'use strict'
const { Client } = require('@elastic/elasticsearch')

let clients = {}     // multi connections

const instanceEventListeners = async (elasticClient) => {
    try {
        console.log(`Successfully connected Elasticsearch 22111!`)

        await elasticClient.ping()
        console.log(`Successfully connected Elasticsearch 222!`)
    } catch (error) {
        console.error(`Error connecting to elasticsearch `, error)
    }
}

const init = ({
    ELASTICSEARCH_IS_ENABLED,
    ELASTICSEARCH_HOSTS = 'http://localhost:9200'
}) => {
    if (ELASTICSEARCH_IS_ENABLED) {
        const elasticClient = new Client({ node: ELASTICSEARCH_HOSTS })
        clients.elasticClient = elasticClient

        console.log(`Successfully connected Elasticsearch 111!`)

        // handle connect
        instanceEventListeners(elasticClient)
    }
}

const getClients = () => clients

const closeConnections = () => {
    // ...
}

module.exports = {
    init,
    getClients,
    closeConnections
}