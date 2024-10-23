'use strict'

const crypto = require('crypto')
const OTP = require('../models/otp.model')

const generatorTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32))
    return token
}

const newOtp = async (email) => {
    const token = generatorTokenRandom()
    const newToken = await OTP.create({
        otp_token: token.toString(),
        otp_email: email
    })
    return newToken
}

const checkEmailToken = async ({
    token
}) => {
    // check token in model otp
    const hasToken = await OTP.findOne({
        otp_token: token
    }).lean()
    if (!hasToken) {
        throw new Error('token not found !')
    }

    // delete token from model
    // OTP.deleteOne({ otp_token: token }).lean()

    return hasToken    
}

module.exports = {
    newOtp,
    checkEmailToken
}