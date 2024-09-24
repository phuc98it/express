'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const cartController = require('../../controllers/cart.controller')

router.post('', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.updateToCart))
router.delete('', asyncHandler(cartController.deleteCart))
router.get('', asyncHandler(cartController.listCart))

module.exports = router