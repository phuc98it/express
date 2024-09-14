const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()
const { checkOverload } = require('./helpers/check.connect')


// init middlewares
app.use(morgan("dev"))          // option : compile | common | short | tiny | dev
app.use(helmet())               // ngăn chặn 1 số thông tin ngậy cảm server - tránh lộ info để hacker phá
app.use(compression())          // nén data -> giảm tải dung lượng khi request và response
app.use(express.json())         // thay thế cho body-parser
app.use(express.urlencoded({    
    extended: true
}))


// init db
require('./dbs/init.mongodb')

checkOverload()

// init routes
app.use('/', require('./routes'))


// handling error

module.exports = app