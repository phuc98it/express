const { mongoose, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user : {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey : {           // Access Token
        type: String,
        required: true
    },
    privateKey : {
        type: String,
        required: true
    },
    refreshToken: { 
        type: String, 
        required: true 
    },
    refreshTokensUsed: {
        type: Array,
        default: []     // refreshTokens đã từng dùng
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);