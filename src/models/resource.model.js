"use strict"

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

const resourceSchema = new Schema({
    src_name: { type: String, require: true },      // profile
    src_slug: { type: String, require: true },      // 000001   - kí tự nhân biết resource.
    src_description: { type: String, default: '' }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, resourceSchema)
