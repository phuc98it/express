const { mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {      // phân biệt giữa các nhãn hàng
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema)