'use strict'

const { inventory } = require('../inventory.model')

const insertInventory = async ({
    productId, shopId, stock, location = 'unKnow'
}) => {
    console.log("Id Shop [2] ::: ", shopId)
    return await inventory.create({
        inven_productId: productId,
        inven_stock: stock,
        inven_location: location,
        inven_shop: shopId
    })
}

const reservationInventory = async ({
    productId,
    quantity,
    cartId
}) => {
    const query = {
        inven_productId: productId,
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $in: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = {
        upsert: true,
        new: true
    }

    return await inventory.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory
}