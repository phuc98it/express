"use strict"

const cloudinary = require("../configs/cloudinary.config")

// 1 - Upload from url Image
const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/919d5bffda0f846f945f139fe9e511f9.webp'
        const folderName = 'product/shopId',
            newFileName = 'testdemo'

        const result = await cloudinary.uploader.upload(
            urlImage,
            { 
                public_id: newFileName,
                folder: folderName
            }
        )
        
        return result
    } catch (error) {
        console.error('Error uploading image :: ', error)
    }
}

// 2 - upload from Local
const uploadImageFromLocal = async ({path, folderName = 'product/'}) => {
    try {
        const result = await cloudinary.uploader.upload(
            path,
            {
                public_id: 'thumb',
                folder: folderName
            }
        )
        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(
                result.public_id,
                {
                    height: 100,
                    width: 100,
                    format: 'jpg'
                }
            )
        }
    } catch (error) {
        console.error("Error :: ", error)
    }
}

// 3 - upload files from Local
const uploadImageFromLocalFiles = async ({
    files, 
    folderName = 'product/'
}) => {
    try {
        console.log('files :: ', files, folderName)
        if (!files.length) return

        const uploadedUrls = []
        for (const file of files) {
            const result = await cloudinary.uploader.upload(
                file.path,
                { folder: folderName }
            )

            uploadedUrls.push({
                image_url: result.secure_url,
                shopId: 8409,
                thumb_url: await cloudinary.url(
                    result.public_id,
                    {
                        height: 100,
                        width: 100,
                        format: 'png'
                    }
                )
            })
        }
        
        return uploadedUrls
    } catch (error) {
        console.error("Error :: ", error)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles
}