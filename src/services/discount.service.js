'use strict'

/**
 * 1 - Generator Discount Code [Shop | Admin]
 * 2 - Get Discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')

const { discount } = require('../models/discount.model')
const { findAllDiscountCodesUnSelect, checkDiscountExists } = require('../models/repositories/discount.repository')
const { findAllProducts } = require('../models/repositories/product.repository')
const { convertToObjectIdMongodb } = require('../utils')

class DiscountService {
    // Generator Discount Code
    static async createDiscountCode(payload) {
        const {
            code, 
            start_date, 
            end_date, 
            is_active, 
            shopId, 
            min_order_value, 
            product_ids, 
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            users_used,
            max_uses,
            uses_count,
            max_uses_per_user
        } = payload

        // if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expired!')
        // }

        if(new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }

        // Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId     // convertToObjectIdMongodb(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start: new Date(start_date),
            discount_end: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_appllies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    // Get all products by discount 'code' available  -> List products used 'code'
    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId     // convertToObjectIdMongodb(shopId)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exist!')
        }

        const { discount_appllies_to, discount_product_ids } = foundDiscount
        
        let products

        if(discount_appllies_to === 'specific') {
            // Get all products
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_appllies_to === 'all') {
            // Get all products
            products = await findAllProducts({
                filter: {
                    product_shop: shopId,    // convertToObjectIdMongodb(shopId)
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    // Get All Discount by ShopId
    static async getAllDiscountCodesByShop({limit, page, shopId}) {
        const foundDiscount = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId, //convertToObjectIdMongodb(shopId)
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })

        return foundDiscount
    }

    // Apply Discount Code
    static async getDiscountAmount({codeId, userId, shopId, products}) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: shopId     // convertToObjectIdMongodb(shopId)
            }
        })

        if(!foundDiscount) {
            throw new NotFoundError('Discount does not exists!')
        }

        console.log('[===] ::: ', foundDiscount)
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_start,
            discount_end,
            discount_type,
            discount_value
        } = foundDiscount

        if(!discount_is_active) {
            throw new NotFoundError('Discount expired!')
        }

        if(!discount_max_uses) {
            throw new NotFoundError('Discount are out!')
        }

        if(new Date() < new Date(discount_start) || new Date() > new Date(discount_end)) {
            throw new NotFoundError('Discount encode has expired!')
        }


        let totalOrder
        // Check xem gia tri toi thieu hay khong?
        if(discount_min_order_value > 0) {
            // Get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            console.log('totalOrder ::: ', totalOrder)

            if(totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount required a minimun order value of ${discount_min_order_value}`)
            }
        }

        // if(discount_max_uses_per_user > 0) {
        //     const userDiscount = discount_users_used.find(user => user.userId === userId)
        //     if(userDiscount) {
        //         // ...

        //     }

            
        // }

        // check Discount fix-amount hay percent
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder, 
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }

    // User Cancel Discount Code
    static async cancelDiscountCode({codeId, shopId, userId}) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if(!foundDiscount) throw new NotFoundError('Discount does not exists!')

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService