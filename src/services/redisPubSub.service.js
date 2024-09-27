'use strict'

const redis = require('redis')

class RedisPubSubService {
    constructor() {
        this.subscriber = redis.createClient()
        this.publisher = redis.createClient()
    }

    publish(channel, message) {
        console.log('message Input ::: ', message)
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err)
                    res.end('Internal Server Error');

                } else {
                    resolve(reply)
                }
            })
        })
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel)
        this.subscriber.on('message', (sucscriberChannel, message) => {
            if(channel === sucscriberChannel) {
                callback(channel, message)
            }
        })
    }
}

module.exports = new RedisPubSubService()