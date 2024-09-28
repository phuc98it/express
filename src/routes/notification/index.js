'use strict'

const express = require('express')
const router = express.Router()
const NotificationController = require('../../controllers/notification.controller')

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')

// Authentication
router.use(authentication)


// Query //
router.get('', asyncHandler(NotificationController.listNotifByUser))

module.exports = router