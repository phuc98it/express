const app = require("./src/app")

const PORT = process.env.PORT | 3002

const server = app.listen(PORT, () => {
    console.log(`WSL eCommerce start with ${PORT}`)
})

process.on('SIGNIN', () => {
    server.close( () => console.log(`Exit Server Express`))
})