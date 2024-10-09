'use strict'

const express = require('express')
const router = express.Router()

const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')


// Search
router.get('/search/:keySearch', asyncHandler(productController.searchProducts))
router.get('/sku/select_variation', asyncHandler(productController.findOneSku))
router.get('/spu/get_spu_info', asyncHandler(productController.findOneSpu))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))


// Authentication
router.use(authentication)

// product
router.post('/', asyncHandler(productController.createProductController))
router.post('/spu/new', asyncHandler(productController.createSpu))


// Set update
router.put('/publish/:id', asyncHandler(productController.publishProductByShop))
router.put('/unpublish/:id', asyncHandler(productController.unpublishProductByShop))
router.patch('/:productId', asyncHandler(productController.updateProduct))


// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))


module.exports = router