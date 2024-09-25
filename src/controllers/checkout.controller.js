'use strict'

const CheckoutService = require("../services/checkout.service")
const { SuccessResponse } = require('../core/success.response')


class CheckoutController {
    checkoutReview = async (req, res, next) => {
        console.log("AAaAA ::: ", req.body)
        new SuccessResponse({
            message: 'Create new Cart success!',
            metadata: await CheckoutService.checkoutReview({
                cartId: req.body.cartId,
                userId: req.body.userId,
                shop_order_ids : req.body.shop_order_ids
            })            
        }).send(res)
    }
}

module.exports = new CheckoutController()