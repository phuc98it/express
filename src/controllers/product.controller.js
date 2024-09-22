'use strict'

const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProductController = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Published success!',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update unPublished success!',
            metadata: await ProductService.unpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }
    /**
     * desc Get all Drafts for Shop
     * @param {Number} limit
     * @param {Number} skip 
     * @return {JSON} 
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Publish success!',
            metadata: await ProductService.findAllPublishsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    searchProducts = async (req, res, next) => {
        new SuccessResponse({
            message:'Result search products',
            metadata: await ProductService.searchProducts({keyInsert: req.params.keySearch})
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProducts success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProducts success!',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "",
            metadata: await ProductService.updateProduct(
                req.body.product_type, 
                req.params.productId,
                { ...req.body, product_shop: req.user.userId }
            )
        }).send(res)
    }
}

module.exports = new ProductController()