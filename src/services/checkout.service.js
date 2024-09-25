'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')
const { checkProductByServer } = require("../models/repositories/product.repository")
const { getDiscountAmount } = require("./discount.service")

/*
{
    cartId,
    userId,
    shop_order_ids: [
        {
            shopId,
            shop_discounts: [        --> Discount
                {
                    "shopId",
                    "discountId",
                    codeId
                },
                ...
            ],
            item_products: [        --> Product
                {
                    price,
                    quantity,
                    productId
                },
                ...
            ]
        },
        ...
    ]
}
*/

class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids = []
    }) {
        console.log('[-0-] ::: ', cartId, userId, shop_order_ids)

        // Check cartId ton tai khong?
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new NotFoundError('Cart does not exist!')

        console.log('[-1-] ::: ', foundCart)
        const checkout_order = {
            totalPrice: 0,      // tong tien hang
            feeShip: 0,         // phi van chuyen
            totalDiscount: 0,   // tong tien discount
            totalCheckout: 0    // tong thanh toan
        }

        const shop_order_ids_new = []

        // Tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            console.log('[-2-] ::: ', item_products)
            // Check product available
            const checkProductServer = await checkProductByServer(item_products)

            console.log(`checkProductServer ::: `, checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError('order wrong !!!')

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            console.log(`checkoutPrice ::: `, checkoutPrice)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice =+ checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,            // tine truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            console.log(`shop_discounts ::: `, shop_discounts)


            if(shop_discounts.length > 0) {
                //Gia su chi co 1 discount
                const { totalPrice, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                console.log(`Discount ::: `, discount)

                // Tong cong discount giam gia
                checkout_order.totalDiscount += discount

                


                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout = itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService