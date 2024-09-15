'use strict'

const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProductController = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.user_id
            })
        }).send(res)
    }
}

module.exports = new ProductController()