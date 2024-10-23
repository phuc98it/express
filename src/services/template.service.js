'use strict'

const TEMPLATE = require('../models/template.model')
const { htmlEmailToken } = require('../utils/tem.html')

const newTemplate = async ({
    tem_id = 0,
    tem_name,
    tem_html
}) => {
    console.log("input ::: ", {tem_id, tem_name})
    // console.log("check template ::: ", htmlEmailToken())
    // 1. check if template exists

    // 2. create a new template
    const newTem = await TEMPLATE.create({
        tem_id,
        tem_name,
        tem_html: htmlEmailToken()
    })

    return newTem
}

const getTemplate = async ({
    tem_name
}) => {
    const template = await TEMPLATE.findOne({
        tem_name
    }).lean()

    return template
}

module.exports = {
    newTemplate,
    getTemplate
}