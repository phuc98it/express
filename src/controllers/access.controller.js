'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async(req, res, next) => {
        new CREATED({
            message : 'Registerd OK HAHA!',
            metadata : await AccessService.signUp(req.body)
        }).send(res)
    }

    handlerRefreshToken = async(req, res, next) => {
        new SuccessResponse({
            message : 'Get token success!',
            metadata : await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }

    handlerRefreshTokenV2 = async(req, res, next) => {
        new SuccessResponse({
            message : 'Get token success!',
            metadata : await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success !',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
}

module.exports = new AccessController()