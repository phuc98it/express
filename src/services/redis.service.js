'use strict'

const redis = require('redis')
const { promisify } = require('util')       // promisify - chuyen doi ham co ban -> promise
const { reservationInventory } = require('../models/repositories/inventory.repository')
const redisClient = redis.redisClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)    // => promise(...)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient) // => promise(...)

const acquireLock = async (productId, quantity, cartId) => {
    const key =  `lock_v2023_${productId}`
    const retryTimes = 10       // so lan retry
    const expireTime = 3000     // thoi gian ton tai cua key - 3s
    
    for (let i = 0; i < retryTimes.length; i++) {
        // Tao 1 key - ai nam giu duoc -> vao thanh toan
        const result = await setnxAsync(key, expireTime)    // req nào được cấp 'key' -> thì req đó đc xử lí.
        console.log(`result ::: `, result)

        if(result === 1) {
            // tuong tac voi inventory
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId
            })

            if(isReservation.modifiedCount) {
                await pexpire(key, expireTime)      // giai phong key
                return key
            }

            return key
        } else {
            // retry lai - moi lan cach nhau 0.05s
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(
        redisClient.del
    ).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}