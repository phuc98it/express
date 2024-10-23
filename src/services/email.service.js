'use strict'

const transport = require('../dbs/init.nodemailer')
const { newOtp } = require("./otp.service")
const { getTemplate } = require("./template.service")
const { NotFoundError } = require('../core/error.response')
const { replacePlaceholder } = require("../utils")

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = 'Xác nhận Email đăng ký!',
    text = 'Xác nhận ... '
}) => {
    try {
        const mailOptions = {
            from: 'Demo_1@email.com',
            to: toEmail,
            subject,
            text,
            html
        }

        transport.sendMail(mailOptions, (err, info) => {
            if(err) {
                return console.log(err)
            }
            
            console.log('Message sent :: ', info.messageId)
        })
    } catch (error) {
        console.error(`Error send Email :: `, error)
        return error
    }
}

const sendEmailToken = async ({
    email = null
}) => {
    try {
        // 1. get Token
        const token = await newOtp(email)

        // 2. get Template
        const template = await getTemplate({
            tem_name: 'HTML EMAIL TOKEN'
        })

        if(!template) {
            throw new NotFoundError('Template not found !')
        }

        // 3. replace PlaceHolder
        const content = replacePlaceholder(
            template.tem_html,
            { link_verify: `http://localhost:3056/v1/api/user/welcome-back?token=${token.otp_token}` }
        )

        // 4. Send mail
        await sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Vui lòng xác nhận địa chỉ Email đăng ký ...'
        }).catch(err => console.error(err))

        return 1
    } catch (error) {
        console.error('Error :: ', error)
    }
}

module.exports = {
    sendEmailToken
}