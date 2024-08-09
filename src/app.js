const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()



// init middlewares
app.use(morgan("dev"))  // option : compile | common | short | tiny | dev
app.use(helmet())       // ngăn chặn 1 số thông tin ngậy cảm server - tránh lộ info để hacker phá
app.use(compression())  // nén data -> giảm tải dung lượng khi request và response


// init db

// init routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "Welcome Dev"
    })
})

// handling error

module.exports = app