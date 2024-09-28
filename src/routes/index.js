'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const { createApiKey } = require('../services/apikey.service')
const router = express.Router()
const { pushToLogDiscord } = require('../middlewares/index')

// Add Log -> to Discord
router.use(pushToLogDiscord)

router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "Welcome Dev"
    })
})

router.post('/v1/api-key', async (req, res, next) => {
    await createApiKey()
    return res.status(200).json({
        message: "Create API Key success!"
    })
})

// Check apiKey
router.use(apiKey)

// Check permission
router.use(permission('0000'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/comment', require('./comment'))

router.use('/v1/api', require('./access'))

module.exports = router