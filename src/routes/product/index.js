'use strict'

const express = require('express')
const router = express.Router()

const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')

// Authentication
router.use(authenticationV2)

// product
router.post('/', asyncHandler(productController.createProductController))

module.exports = router