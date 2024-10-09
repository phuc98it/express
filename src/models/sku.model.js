'use strict'

const { Schema, model } = require("mongoose")
const slugify = require('slugify')

const DOCUMENT_NAME = 'Sku'
const COLLECTION_NAME = 'Skus'

const skuSchema = new Schema({
    sku_id : { type: String, required: true, unique: true },    // string "{spu_id}123345-{shopId}"
    sku_tier_idx: { type: Array, default: [0] },
    /*      Example : sku_tier_idx
        color = [red, green] = [0, 1]
        size = [S, M] = [0, 1]

        =>  red + S     = [0, 0]
            red + M     = [0, 1]
            green + S   = [1, 0]
            green + M   = [1, 1]    
    */

    sku_default : { type: Boolean, default: false },
    sku_slug : { type: String, default: '' },
    sku_sort : { type: Number, default: 0 },
    sku_price : { type: String, required: true },
    sku_stock : { type: String, default: 0 },           // array in of stock
    product_id : { type: String, required: true },      // ref to SPU product

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})



module.exports = model(DOCUMENT_NAME, skuSchema)