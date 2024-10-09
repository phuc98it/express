'use strict'

const { Schema, model } = require("mongoose")
const slugify = require('slugify')

const DOCUMENT_NAME = 'Spu'
const COLLECTION_NAME = 'Spus'

const spuSchema = new Schema({
    product_id: { type: String, default: '' },
    product_name: { type: String, required: true },
    product_thumb: {type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: {type: Number, required: true },
    product_category: {type: Array, required: [] },         // 1 sản phẩm có thể  thuộc nhiều thể loại khác nhau
    // product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture']},    --> Bỏ
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    /*  product_attributes
        {
            attribute_id: 12345,   
            attribute_values: [
                {
                    value_id: 123
                }
            ]
        }
    */

    // more ...
    product_slug: { type: String },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be about 1.0'],
        max: [5, 'Rating must be about 5.0'],

        // 4.345666 -> 4.5
        set: (val) => Math.round(val * 10)/10
    },

    product_variations: { type: Array, default: [] },       // option: cho user lựa chọn
    /*
        tier_varation: [
            {
                images: [],
                name: 'color',
                options:: ['red', 'green']
            },
            {
                name: 'size',
                options: ['S', 'M'],
                images: []
            }
        ]
    */

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// Create Index for search
spuSchema.index({product_name: 'text', product_description: 'text'})

// Document middleware: runs BEFORE .save() and .create() ...
spuSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


module.exports = model(DOCUMENT_NAME, spuSchema)