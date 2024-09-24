'use strict'

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cart_state: {
        type: String,
        require: true,
        enum: ['active', 'completed', 'failed'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        require: true,
        default: []
    },
    cart_count_product: {type: Number, default: 0},     // <=> cart_products.quatity
    cart_userId: {type: Number, require: true}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}