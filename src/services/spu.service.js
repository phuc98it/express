'use strict'

const SPU_MODEL = require('../models/spu.model')
const { NotFoundError } = require("../core/error.response")
const { findShopById } = require("../models/repositories/shop.repository")
const { randomProductId } = require('../utils')
const { newSku, allSkuBySpuId } = require('./sku.service')

const newSpu = async ({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_quantity,
    product_attributes,
    product_variations,
    sku_list = []           // san pham con
}) => {
    try {
        // 1. check Shop exists
        const foundShop = await findShopById({
            shop_id: product_shop
        })
        if(!foundShop) throw new NotFoundError('Shop not found!')

        // 2. create a new SPU
        const spu = await SPU_MODEL.create({
            product_id: randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_quantity,
            product_variations
        })

        console.log("sku_list [1] ::: ", sku_list)
        // 3. get spu_id add to sku.service
        if (spu && sku_list.length) {
            // 3. create Skus
            newSku({sku_list, spu_id: spu.product_id})
            .then()
        }

        // 4. Sync data via Elasticsearch (search.service)

        // 5. respond result object
        return !!spu
    } catch (error) {
        
    }
}

const oneSpu = async ({spu_id}) => {
    try {
        const spu = await SPU_MODEL.findOne({
            product_id: spu_id,
            isPublished: false
        }).lean()

        if (!spu) {
            throw new NotFoundError('SPU not found!')
        }

        const skus = await allSkuBySpuId({ product_id: spu.product_id })

        return skus
    } catch (error) {
        return {}
    }
}

module.exports = {
    newSpu,
    oneSpu
}