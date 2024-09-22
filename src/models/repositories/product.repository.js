'use strict'

// const { Types } = require('mongoose')
const { product, electronic, clothing, furniture  } = require('../product.model')

const findAllDraftsForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop,   //: new Types.ObjectId(product_shop),
        _id: product_id             //: new Types.ObjectId(product_id)
    })

    if(!foundShop) {
        return null
    }

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unpublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop,   //: new Types.ObjectId(product_shop),
        _id: product_id             //: new Types.ObjectId(product_id)
    })

    if(!foundShop) {
        return null
    }

    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const findAllPublishForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const searchProducts = async ({ keyInsert }) => {
    console.log("keySearch ::: ", keyInsert)
    const regexSearch = new RegExp(keyInsert)
    console.log("regexSearch ::: ", regexSearch)
    const result = await product.find(
        {
            isPublished: true,
            $text: { $search: regexSearch }
        },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).lean()

    return result
}
module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProducts
}