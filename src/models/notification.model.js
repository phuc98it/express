'use strict'

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = "Notifications"

/** Types Notif
 * ORDER-001 : order successfuly
 * ORDER-002 : order failed
 * PROMOTION-001 : new PROMOTION
 * SHOP-001 : new product by User following
 */

const notificationSchema = new Schema({
    noti_type: { 
        type: String, 
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION', 'SHOP-001'],
        require: true 
    },
    noti_senderId: { type: Schema.Types.ObjectId, require: true, ref: 'Shop' },
    noti_content: { type: String, require: true },
    noti_receivedId: { type: String, require: true },
    noti_options: { type: Object, default: {} }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, notificationSchema)