'ise strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

var orderSchema = new Schema({
    order_userId : { type: Number, require: true },
    order_checkout : { type: Object, default: {}},
    /** result - after checkout review
     order_checkout = {
      totalPrice,
      totalApplyDiscount,
      feeShip
     }
     */

    order_shipping: { type: Object, default: {}},
    /** location and state of shipping
     order_checkout = {
      street,
      city,
      state,
      country
     }
     */

    order_payment: { type: Object, default: {}},
    order_products: { type: Array, require: true },    // <=> shop_order_ids_new
    order_trackkingNumber: { type: String, default: '#000'},
    order_status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending' 
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, keyTokenSchema)
}