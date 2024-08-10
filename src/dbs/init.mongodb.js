'use strict'

const mongoose = require('mongoose')
const { countConnect } = require('../helpers/check.connect')
const connectString = `mongodb://localhost:27017/shopDEV`

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
            _ => console.log(`Connected Mongodb Success`, countConnect())
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