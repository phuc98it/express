'use strict'

const logger = require('../logger/discord.log')

const pushToLogDiscord = async (req, res, next) => {
    try {
        // logger.sendToMessage(req.get('host'))
        logger.sendToFormatCode({
            title: `Method: ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`
        })
        
        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    pushToLogDiscord
}