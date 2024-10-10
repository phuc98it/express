'use strict'

const express = require('express')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/auth.Utils')
const uploadController = require('../../controllers/upload.controller')
const { uploadToDisk, uploadToMemory } = require('../../configs/multer.config')

// Authentication
// router.use(authentication)

router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadToDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))
router.post('/product/multiple', uploadToDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles))

// Upload to -> S3
router.post('/product/bucket', uploadToMemory.single('file'), asyncHandler(uploadController.uploadImageFromLocalToS3))


module.exports = router