const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()
const { checkOverload } = require('./helpers/check.connect')
const { v4:uuidv4 } = require('uuid')
const myLogger = require('./logger/mylogger.log')

// init middlewares
app.use(morgan("dev"))          // option : compile | common | short | tiny | dev
app.use(helmet())               // ngăn chặn 1 số thông tin ngậy cảm server - tránh lộ info để hacker phá
app.use(compression())          // nén data -> giảm tải dung lượng khi request và response
app.use(express.json())         // thay thế cho body-parser
app.use(express.urlencoded({    
    extended: true
}))

// test redis pub-sub
require('./tests/inventory.test')
const productTest = require('./tests/product.test')
productTest.purchaseProduct('productId:001', 10)

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id']       // from Proxy
    req.requestId = requestId ? requestId : uuidv4()
    myLogger.log(`input params :: ${req.method} :: `, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' ? req.body : req.query
    ])

    next()
})

// init db
require('./dbs/init.mongodb')

checkOverload()

// init routes
app.use('/', require('./routes'))


// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`

    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        { message: error.message }
    ])

    const statusCode = error.status || 500

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error"
    })
})

module.exports = app