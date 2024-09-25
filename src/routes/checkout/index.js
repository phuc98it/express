'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const checkoutController = require('../../controllers/checkout.controller')

/** Test
 * 1 - Tao discoutn cho Product
 * 2 - Tao product cho 2 Shop khac nhau
 * 3 - Tao data -> Check Review
 */
router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router