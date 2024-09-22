'use strict'

const apiKeyModel = require('../models/api-key.model')

const crypto =  require('crypto')

const findById = async (key) => {
    const objKey = await apiKeyModel.findOne({key, status: true}).lean()

    return objKey
}

const createApiKey = () => {
    const newKey = apiKeyModel.create({
        key: crypto.randomBytes(64).toString('hex'),
        permissions: ['0000']
    })

    return newKey
}

module.exports = {
    findById,
    createApiKey
}