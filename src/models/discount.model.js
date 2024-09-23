'use strict'

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: { type: String, default: 'fixed_amount' },       // fixed_amount: so tien || percentage: phan tram
    discount_value: { type: Number, require: true },
    discount_max_value: { type: Number, require: true },
    discount_code: { type: String, require: true },                 // ma 'code'
    discount_start: { type: Date, require: true },
    discount_end: { type: String, require: true },
    discount_max_uses: { type: Number, require: true },             // so luong voucher dc ap dung
    discount_uses_count: { type: Number, require: true },           // so luong discoutn da dc su dung 
    discount_users_used: { type: Array, default: [] },               // ai da su dung
    discount_max_uses_per_user: { type: Number, require: true },    // so luong cho phep toi da cho 1 user
    discount_min_order_value: { type: Number, require: true },      // gia toi thieu -> su dung voucher
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, require: true },           // hieu luc voucher
    discount_appllies_to: { type: String, require: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] },              // so product dc ap dung
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}