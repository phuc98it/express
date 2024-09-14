'use strict'

const mongoose = require('mongoose')
const { countConnect } = require('../helpers/check.connect')
const config = require('../configs/config.mongodb')
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`

class Database {
    constructor() {
        this.connect()
    }

    // connect
    connect(type = 'mongodb') {
        if (1 === 1) {  //ghi log o dev
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        // connect db
        mongoose.connect(connectString).then(
            _ => console.log(`Connected Mongodb Success`, connectString)
        ).catch(
            err => console.log(`Error Connect!`)
        )
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb