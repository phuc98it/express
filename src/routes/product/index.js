'use strict'

const express = require('express')
const router = express.Router()

const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')


// Search
router.get('/search/:keySearch', asyncHandler(productController.searchProducts))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))


// Authentication
router.use(authentication)

// product
router.post('/', asyncHandler(productController.createProductController))

// Set update
router.put('/publish/:id', asyncHandler(productController.publishProductByShop))
router.put('/unpublish/:id', asyncHandler(productController.unpublishProductByShop))
router.patch('/:productId', asyncHandler(productController.updateProduct))


// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))


module.exports = router