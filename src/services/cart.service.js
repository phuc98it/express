'use strict'

/** Key feature : Cart Service
 * 1 - add product to cart
 * 2 - reduce product quantity by One [User]
 * 3 - Increase product quantity by One
 * 4 - Get cart [User]
 * 5 - Delete cart [User]
 * 6 - Delete cart item [User]
 */

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')
const { cart } = require('../models/cart.model'); 
const { getProductById } = require('../models/repositories/product.repository');

class CartService {
    // START REPO CART ///
    static async createUserCart({userId, product}) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            },
            options = {
                upsert: true,
                new: true
            }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    // UPDATE REPO CART ///
    static async updateUserCartQuantity({userId, product}) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    // END REPO CART ///
    static async addToCart({userId, product = {}}) {
        // Check cart ton tai hay khong
        const userCart = await cart.findOne({
            cart_userId: userId
        })

        if(!userCart) {
            // create cart for User
            return await CartService.createUserCart({userId, product})
        }

        // chưa có sản phẩm
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // Giỏ hàng hiện tại, đang có sản phẩm -> update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    // Update Cart by item (+/-)
    /** 
     * shop_order_ids: [
     *      {
     *          shopId,
     *          item_products: [
     *              {
     *                  quantity, price, shopId, old_quantity, productId
     *              }
     *          ],
     *          version
     *      }
     * ]
     */
    static async addToCartV2({
        userId, shop_order_ids
    }) {
        const { 
            productId, 
            quantity, 
            old_quantity 
        } = shop_order_ids[0]?.item_products[0]

        // check product
        const foundProduct = await getProductById(productId)

        if(!foundProduct) throw new NotFoundError('')

        // Compare
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }

        if(quantity === 0) {
            // deleted
            await deleteUserCart({userId, productId})
        }
        
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    // Delete
    static async deleteUserCart({userId, productId}) {
        console.log('TYPE ::: ', typeof userId )
        const query = { cart_userId: userId, cart_state : 'active'},
            updateSet = {
                $pull : {
                    cart_products: {
                        productId
                    }
                }
            }

        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({userId}) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService