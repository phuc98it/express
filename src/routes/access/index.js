'use strict'

const express = require('express')
const router = express.Router()

const accessController = require('../../controllers/access.controller')

router.post('/shop/sigup', accessController.signUp)



module.exports = router