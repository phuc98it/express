"use strict"

const cloudinary = require("../configs/cloudinary.config")
const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("../configs/s3.config")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { getSignedUrl : getSignedUrlCF } = require("@aws-sdk/cloudfront-signer")
const urlCloudFrontPublic = process.env.AWS_CLOUDFRONT


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

// S3 - AWS
const uploadImageFromLocalToS3 = async ({ file }) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.originalname || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        const result = await s3.send(command)       // push to S3
        // return result

        const getImage = new GetObjectCommand({     // get from s3 by 'key'
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.originalname || 'unknown',
        });
        const url = await getSignedUrl(s3, getImage, { expiresIn: 3600 });

        // with CloudFront url
        const urlCF = getSignedUrlCF({
            url: `${urlCloudFrontPublic}/${file.originalname}`,
            keyPairId: process.env.AWS_CLOUDFRONT_PUBLIC_KEY,
            dateLessThan: new Date(Date.now() + 1000 * 60),     // expire ~ 60s
            privateKey: process.env.PRIVATE_KEY,
          })
        return {
            url,        // for not CDN
            urlCF,      // for use CDN
            result
        }
    } catch (error) {
        console.error("Error :: ", error)
    }
}

// const getImageFromS3 = async ({ file }) => {
//     try {
//         const command = new PutObjectCommand({
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: file.originalname || 'unknown',
//             Body: file.buffer,
//             ContentType: 'image/jpeg'
//         })

//         const result = await s3.send(command)

//         //const client = new S3Client(clientParams);
//         const command = new GetObjectCommand(getObjectParams);
//         const url = await getSignedUrl(client, command, { expiresIn: 3600 });


//         const url = await getSignedUrl(s3, result, {expiresIn: 3600})
//         return url
//     } catch (error) {
//         console.error("Error :: ", error)
//     }
// }

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
    uploadImageFromLocalToS3
}