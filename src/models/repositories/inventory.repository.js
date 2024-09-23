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

module.exports = {
    insertInventory
}