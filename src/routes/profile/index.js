'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const profileController = require('../../controllers/profile.controller')
const { grantAccess } = require('../../middlewares/rbac')

// Admin
router.get('/viewAny', grantAccess('readAny', 'profile'), profileController.profiles)

// Shop
router.get('/viewOwn', grantAccess('readOwn', 'profile'), profileController.profile)

module.exports = router