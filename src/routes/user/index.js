'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const userController = require('../../controllers/user.controller')
const { grantAccess } = require('../../middlewares/rbac')

router.post('/new_user', asyncHandler(userController.newUser))
router.post('/welcome-back', asyncHandler(userController.checkLoginEmailToken))
module.exports = router