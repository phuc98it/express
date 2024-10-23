'use strict'

const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { BadRequestError } = require('../core/error.response')
const USER = require('../models/user.model')
const { sendEmailToken } = require('./email.service')
const { checkEmailToken } = require('./otp.service')
const { createUser } = require('../models/repositories/user.repo')
const { getInfoData } = require('../utils')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require('../auth/auth.Utils')



const newUserService = async ({
    email = null,
    captcha = null
}) => {
    // 1. Check email exists in dbs
    const user = await USER.findOne({email}).lean()

    // 2. If exists
    if(user) {
        return BadRequestError({
            message: 'Email already exists !'
        })
    }

    // 3. Send token via email User
    const result = await sendEmailToken({email})

    return {
        token: result
    }
}

const findUserByEmailWithLogin = async ({email}) => {
    const user = await USER.findOne({usr_email: email}).lean()
    return user
}

const checkLoginEmailTokenService = async ({token}) => {
    try {
        // 1. check token in node otp
        const { otp_email: email, otp_token } = await checkEmailToken({token})
        if (!email) {
            throw new BadRequestError('Token not found !')
        }

        // 2. check email exists in user model
        const hasUser = await findUserByEmailWithLogin({email})
        if (hasUser) {
            throw new BadRequestError(`Email already exists !`)
        }

        // 3. new User  14:30
        const passwordHash = await bcrypt.hash(email, 10)

        const newUser = await createUser({
            usr_id: 1,
            usr_slug: 'xyzwww',
            usr_email: email,
            usr_password: passwordHash,
            usr_role: ''
        })

        if (newUser) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser.usr_id,
                publicKey,
                privateKey
            })
            
            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error'
                }
            }

            // created token pair
            const tokens = await createTokenPair({
                userId: newUser.usr_id,
                email
            }, publicKey, privateKey)

            return {
                code: 201,
                message: 'Verify Successfully !',
                metadata: {
                    user: getInfoData({
                        fields: ['usr_id', 'usr_name', 'usr_email'],
                        object: newUser
                    }),
                    tokens
                }
            }
        }
    } catch (error) {
        console.error("Error ::: ", error)
    }
}

module.exports = {
    newUserService,
    checkLoginEmailTokenService
}