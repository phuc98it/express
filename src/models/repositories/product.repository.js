'use strict'

const { getSelectData, getUnSelectData } = require('../../utils')
// const { Types } = require('mongoose')
const { product, electronic, clothing, furniture  } = require('../product.model')

const findAllDraftsForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop,               //: new Types.ObjectId(product_shop),
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
        product_shop,               //: new Types.ObjectId(product_shop),
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

const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect))
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
    const regexSearch = new RegExp(keyInsert)
    const result = await product.find(
        {
            isPublished: true,
            $text: { $search: regexSearch }
        },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).lean()

    return result
}

const updateProductById = async ({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })   
}

const getProductById = async (productId) => {
    return await product.findOne({_id: productId}).lean()
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
}