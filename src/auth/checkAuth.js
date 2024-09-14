'use strict'

const { findById } = require('../services/apikey.service')

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        // Check header có API_KEY ? -> 'Shop - thương hiệu' request
        const key = req.headers[HEADER.API_KEY]?.toString()

        if(!key) {
            return res.status(403).json({
                message: 'Forbidden Error 11'
            })
        }

        // Check ObjKey
        const objKey = await findById(key)
        if(!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error 22'
            })
        }

        req.objKey = objKey
        console.log('objKey-111 :: ', req.objKey)
        return next()
    } catch (error) {
        
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        console.log('objKey-222 :: ', req.objKey)
        if(!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        console.log('permissions :: ', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)

        if(!validPermission) {
            return res.status(403).json({
                message: "permission denied!"
            })
        }

        return next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler
}