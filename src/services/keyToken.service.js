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

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async(userId) => {
        return await keyTokenModel.findOne({user: userId}).lean()
    }

    static removeKeyById = async(_id) => {
        return await keyTokenModel.deleteOne({_id})
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokenUsed : refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken}).lean()
    }

    static deleteKeyId = async (userId) => {
        return await keyTokenModel.deleteOne({user : userId})
    }

    static updateRefreshToken = async (_id, tokens, refreshToken) => {
        return await keyTokenModel.updateOne({ _id }, {
            $set: { refreshToken: tokens.refreshToken },
            $addToSet: { refreshTokenUsed: refreshToken }       // add token đã được sử  dụng -> [...]
        });
    }
}

module.exports = KeyTokenService