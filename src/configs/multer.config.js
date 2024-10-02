"use strict"

const multer = require('multer');

const uploadToMemory = multer({
    storage: multer.memoryStorage()
})

const uploadToDisk = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './src/uploads/')
        },
        filename: function(req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
})

module.exports = {
    uploadToMemory,
    uploadToDisk
}