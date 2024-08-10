'use strict'

//Level 1
// const config = {
//     app : {
//         port: 3000,
//     },
//     db : {
//         host: 'localhost',
//         port: 27017,
//         name: 'db'
//     }
// }

// Level 2
const dev = {
    app : {
        port: process.env.DEV_PORT || 3000,
    },
    db : {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDev'
    }
}

const pro = {
    app : {
        port: process.env.PRO_PORT,
    },
    db : {
        host: process.env.PRO_DB_HOST,
        port: process.env.PRO_DB_PORT,
        name: process.env.PRO_DB_NAME
    }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]