'use strict'

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const apiKeySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product'},
    inven_location: { type: String, default: 'unKnown' },
    inven_stock: { type: Number, require: true },           // = so luong san pham
    inven_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
    inven_reservations: { type: Array, default: [] }        // đặt hàng trước - chưa thanh toán

    /**         Reservation
     * cartId: ,
     * stock: 1,
     * createdOn: 
     */

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, apiKeySchema)
}