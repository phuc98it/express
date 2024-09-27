require('dotenv').config()
const app = require("./src/app")

console.log('env ::: ', process.env.PORT)

const PORT =  process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`WSL eCommerce start with ${PORT}`)
})

process.on('SIGNIN', () => {
    server.close( () => console.log(`Exit Server Express`))
})