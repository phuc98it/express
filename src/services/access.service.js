'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require('../auth/auth.Utils')
const { getInfoData } = require('../utils/index')
const { AuthFailureError, BadRequestError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR', 
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // Step 1: check email exists ??
            const hodelShop = await shopModel.findOne({email}).lean()
            if (hodelShop) {
                throw new BadRequestError('Error: Shop already  registered!')
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            // === After register account => redirect to Login ref ===
            if(newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({
                    privateKey,
                    publicKey 
                })

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                
                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'keyStore error'
                    }
                }

                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email
                }, publicKey, privateKey)



                // created privateKey, publicKey - verify token
                /*const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })*/

                // buffer -> string -> save DB
                /*const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })*/


                /*if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // create tokens by privateKey and verify by publicKey (save DB)
                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email
                }, publicKeyObject, privateKey)

                console.log(`Create Token Success :: `, tokens) */

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ['_id', 'name', 'email'],
                            object: newShop
                        }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

    static login = async ({email, password, refreshToken = null}) => {
        // 1. Check 'Email' exist
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not registered')
        
        // 2. Match password
        const match = bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication Error')

        // 3. create privateKey and publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // 4. Generate tokens
        const tokens = await createTokenPair({
            userId: foundShop._id,
            email
        }, publicKey, privateKey)

        // 5. ...
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        })

        return  {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }
    }

    static handlerRefreshToken = async (refreshToken) => {
        // check Token đã sử dụng chưa ?
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        
        // Có -> handle
        if(foundToken) {
            // Decode xem mày là thằng nào
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log("[1] -- ", {userId, email})

            // Xóa tất cả token trong keyStore
            await KeyTokenService.deleteKeyId(userId)
            throw new ForbiddenError('Something wrong happend!! Please relogin')
        }

        // Không có -> Ngon
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError('Shop not register!')
        
        // Verify Token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log("[2] -- ", {userId, email})

        // check UserId
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registerd!')

        // create 1 Cặp mới.
        const tokens = await createTokenPair(
            {userId, email},
            holderToken.publicKey,
            holderToken.privateKey
        )

        // update token
        await KeyTokenService.updateRefreshToken(holderToken._id, tokens, refreshToken)
        
        return {
            user: {userId, email},
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }
}

module.exports = AccessService