'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const uploadController = require('../../controllers/upload.controller')
const { uploadToDisk } = require('../../configs/multer.config')

// Authentication
// router.use(authentication)

router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadToDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

// Query

module.exports = router