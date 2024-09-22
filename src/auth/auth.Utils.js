'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization',
    CLIENT_ID : 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id',
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
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async(req, res, next) => {
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

    if(req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshtoken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshtoken, keyStore.privateKey)
    
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshtoken
            return next()
        } catch (error) {
            throw error
        }
    }   
    
    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')
       
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
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
    verifyJWT,
    authenticationV2
}