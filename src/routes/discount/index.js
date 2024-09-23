'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const discountController = require('../../controllers/discount.controller')

// Get Amount a Discount by User
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getDiscountCodesWithProducts))


// Authentication
router.use(authentication)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))

module.exports = router