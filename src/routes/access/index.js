'use strict'

const express = require('express')
const router = express.Router()

const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')

router.post('/shop/sigup', asyncHandler(accessController.signUp))



module.exports = router