'use strict'

const redisPubSubService = require('../services/redisPubSub.service')

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events',  (channel, message) => {
            console.log('Received Message ::: ', message)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(message) {
        console.log('Received Message 2222222 ::: ', message)
        console.log(`Updated inventory ${message.productId} with quantity ${message.quantity}`)
    }
}

module.exports = new InventoryServiceTest()