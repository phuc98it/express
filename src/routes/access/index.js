'use strict'

const express = require('express')
const router = express.Router()

const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')

// Sign Up & Sign In
router.post('/shop/sigup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// Authentication
router.use(authenticationV2)

// Handler RefreshToken
router.use('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshTokenV2))

// Logout
router.post('/shop/logout', asyncHandler(accessController.logout))

module.exports = router