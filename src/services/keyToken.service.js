'use strict'

const keyTokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken }) => {
        try {
            /* Level 0 :::
            // const publicKeyString = publicKey.toString()
            const tokens = await keyTokenModel.create({
                user: userId,
                // publicKey: publicKeyString
                publicKey,
                privateKey
            })

            return tokens ? publicKeyString : null
            */

            // Level xxx ::: Atomic MongoDB
            const filter = { user: userId }, update = {
                publicKey, 
                privateKey, 
                refreshToken,
                refreshTokenUsed: []
            }, options = { upsert: true, new: true }    // -> upsert : true - ám chỉ chưa có thì tạo mới, có rồi thì update.


            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            console.log("5555-Tokens ::: ", tokens)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService