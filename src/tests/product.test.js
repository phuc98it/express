'use strict'

const redisPubSubService = require('../services/redisPubSub.service')

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        console.log("ABC ::: ", productId, quantity)

        const order = {
            productId,
            quantity
        }

        redisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()