'use strict'

const { getClients, init } = require("../../dbs/init.elasticsearch")

init({
    ELASTICSEARCH_IS_ENABLED: true
})

const esClient = getClients().elasticClient

// Search Document
const searchDocument =  async (idxName, docType, payload) => {
    const result = await esClient.search({
        index: idxName,
        type: docType,
        body: payload
    })

    console.log(`search :: `, result?.body?.hits?.hits);
}

// Add Document
const addDocument = async ({idxName, _id, docType, payload}) => {
    try {
        const newDoc = await esClient.index({
            index: idxName,
            type: docType,
            id: _id,
            body: payload
        })
    } catch (error) {
        
    }
}

// Test run
addDocument({
    idxName: 'product_v001',
    _id: '11133333',
    docType: 'product',
    payload: {
        title: "Iphone 11333",
        price: 11333,
        images: '...',
        category: "mobile"
    }
}).then(rs => console.log(rs))