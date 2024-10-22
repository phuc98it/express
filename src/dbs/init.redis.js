'use strict'

const redis = require('redis')
const { RedisErrorResponse } = require('../core/error.response')

const client = {}                               // contain instance Redis

let connectionTimeout

const statusConnecRedis = {
    CONNECT: 'connect',
    END : 'end',
    RECONNECT : 'reconnecting',
    ERROR : 'error'
}

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Redis loi roi anh em',
        en: 'Service connection error'
    },
    REDIS_CONNECT_TIMEOUT
} 

const handleEventConnection = ({connectionRedis}) => {
    connectionRedis.on(statusConnecRedis.CONNECT, () => {
        console.log(`connectionRedis - Connection status: connected`)
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnecRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`)
        // Retry Connect ...
        handleTimeoutError()
    })

    connectionRedis.on(statusConnecRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnected`)
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnecRedis.ERROR, () => {
        console.log(`connectionRedis - Connection status: error ${err}`)
        handleTimeoutError()
    })
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const initRedis = () => {                       // create instance Redis
    const instanceRedis = redis.createClient()
    client.instanceConnect = instanceRedis
    handleEventConnection({
        connectionRedis: instanceRedis
    })
}

const getRedis = () => client

const closeRedis = () => {

}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}