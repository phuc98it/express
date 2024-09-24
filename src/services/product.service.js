'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { 
    findAllDraftsForShop, 
    publishProductByShop, 
    findAllPublishForShop, 
    unpublishProductByShop, 
    searchProducts, 
    findAllProducts, 
    findProduct, 
    updateProductById 
} = require('../models/repositories/product.repository')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repository')

// Defin Factory class to create product
class ProductFactory {
    static async createProduct(type, payload) {
        switch(type) {
            case "Electronic":
                return new Electronic(payload).createProduct()
            case "Clothing":
                return new Clothing(payload).createProduct()
            case "Furniture":
                return new Furniture(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }

    static async updateProduct(type, productId, payload) {
        switch(type) {
            case "Electronic":
                return new Electronic(payload).updateProduct()
            case "Clothing":
                return new Clothing(payload).updateProduct(productId)
            case "Furniture":
                return new Furniture(payload).updateProduct()
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }

    /** Master
    static productRegistry = {}  // key-class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).updateProduct()
    }

    // When add Class spec -> not edit code Logic 
    ProductFactory.registerProductType('Clothing', Clothing)
    ProductFactory.registerProductType('Electronic', Electronic)
    ProductFactory.registerProductType('Furniture', Furniture)
     */


    // Get Drafts
    static async findAllDraftsForShop({
        product_shop,
        limit = 50,
        skip = 0
    }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({query, limit, skip})
    }

    // Set Pubish
    static async publishProductByShop({
        product_shop,
        product_id
    }) {
        return await publishProductByShop({product_shop, product_id})
    }

    // Pubish
    static async findAllPublishsForShop({
        product_shop,
        limit = 50,
        skip = 0
    }) {
        const query = { product_shop, isDraft: false }
        return await findAllPublishForShop({query, limit, skip})
    }

    // Set UnPubish
    static async unpublishProductByShop({
        product_shop,
        product_id
    }) {
        return await unpublishProductByShop({product_shop, product_id})
    }

    // Search Product
    static async searchProducts({keyInsert}) {
        return await searchProducts({keyInsert})
    }

    static async findAllProducts({
        limit = 50,
        sort = 'ctime',
        page = 1,
        filter = { isPublished: true }
    }) {
        return findAllProducts({limit, sort, filter, page, 
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
        })   
    }

    static async findProduct({product_id}) {
        return await findProduct({product_id, unSelect: ['__v', 'product_variations']})
    }

    // static async updateProducts(params) {
        
    // }
}

// Define basic product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes,
        this.product_quantity = product_quantity
    }

    // Create new Product
    async createProduct(product_id) {
        console.log("Id Shop ::: [1]", this.product_shop)
        const newProduct = await product.create({...this, _id: product_id})   // this -> chính là các thuộc tính của Class
        if (newProduct) {
            // add product_stock in inventory collection
            console.log("Id Shop ::: [3]", this.product_shop)
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct
    }

    // Update Product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({productId, bodyUpdate, model: product})
    }

}


// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newClothing) {
            throw new BadRequestError('Create new Clothing error!')
        }

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create new Product error!')
      
        return newProduct
    }

    async updateProduct(productId) {
        // 1. Remove attr has null underfined
        let objectParams = removeUndefinedObject(this)
        // 2. check xem update o cho nao?
        if (objectParams.product_attributes) {
            await updateProductById({
                productId, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing
            })
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        })

        if(!newElectronic) {
            throw new BadRequestError('Create new Electronic error!')
        }

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new Product error!')
      
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if(!newFurniture) {
            throw new BadRequestError('Create new Furniture error!')
        }

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create new Product error!')
      
        return newProduct
    }
}

module.exports = ProductFactory;