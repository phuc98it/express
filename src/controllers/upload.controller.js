'use strict'

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalFiles } = require("../services/upload.service")

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: 'upload successfully uploaded!',
            metadata: await uploadImageFromUrl()
        }).send(res);
    }

    uploadFileThumb = async (req, res, next) => {
        const { file } = req
        if(!file) throw new BadRequestError('File missing')

        new SuccessResponse({
            message: 'upload successfully uploaded!',
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res);
    }

    uploadImageFromLocalFiles = async (req, res, next) => {
        const { files } = req
        if(!files.length) throw new BadRequestError('Files missing')

        new SuccessResponse({
            message: 'upload successfully uploaded!',
            metadata: await uploadImageFromLocalFiles({files})
        }).send(res);
    }
}

module.exports = new UploadController()