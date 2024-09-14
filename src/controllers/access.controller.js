'use strict'

const { CREATED } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async(req, res, next) => {
        new CREATED({
            message : 'Registerd OK HAHA!',
            metadata : await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()