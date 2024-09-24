'use strict'

const { SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")

class CarttController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'deleted Cart success',
            metadata: await CartService.deleteUserCart(req.query)
        }).send(res)
    }

    listCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CarttController()