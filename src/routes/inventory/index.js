'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const inventoryController = require('../../controllers/inventory.controller')

// Authentication
router.use(authentication)

router.post('/', asyncHandler(inventoryController.addStock))

module.exports = router