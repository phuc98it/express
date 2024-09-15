'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization',
    CLIENT_ID : 'x-client-id'
}

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        })

        // refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.log(`error verify:: `, err)
            } else {
                console.log(`decode verify:: `, decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        
    }
}

const authentication = asyncHandler(async(req, res, next) => {
    /**
     * 1 - check UserId missing ??
     * 2 - get AccessToken
     * 3 - verify Token
     * 4 - check User in DB
     * 5 - check keyStore with this userId
     * 6 - OK -> return next()
     */

    // 1
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')


    // 2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found keyStore')
        
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')
       

    // 3
    try {
        console.log("Start ::: ")
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        console.log("keyStore343543 ::: ", decodeUser)

        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, key) => {
    return await JWT.verify(token, key)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}