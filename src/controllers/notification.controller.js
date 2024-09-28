'use strict'

const { SuccessResponse } = require("../core/success.response")
const { listNotifByUser } = require("../services/notification.service")

class NotificationController {
    listNotifByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "List Notification by User",
            metadata: await listNotifByUser(req.query)
        }).send(res)
    }
}

module.exports = new NotificationController()