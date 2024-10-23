'use strict'

const { SuccessResponse } = require('../core/success.response')
const { newUserService, checkLoginEmailTokenService } = require('../services/user.service')

class UserController {
    // new user
    newUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create User success !',
            metadata: await newUserService({email: req.body.email})
        }).send(res)
    }

    // check user token via Email
    checkLoginEmailToken = async (req, res, next) => {
        const {token = null} = req.query
        const respond = await checkLoginEmailTokenService({token})
        new SuccessResponse(respond).send(res)
    }
}

module.exports = new UserController()