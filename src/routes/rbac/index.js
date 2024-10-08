'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const { newRole, newResource, listResource, listRole } = require('../../controllers/rbac.controller')
const { grantAccess } = require('../../middlewares/rbac')

router.post('/role', asyncHandler(newRole))
router.get('/roles', asyncHandler(listRole))

router.post('/resource', asyncHandler(newResource))
router.get('/resources', asyncHandler(listResource))

module.exports = router