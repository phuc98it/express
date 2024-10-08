'use strict';

const { SuccessResponse } = require("../core/success.response");
const { createResource, createRole, roleList, resourceList } = require("../services/rbac.service");

/**
 * @desc Create a new role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create Resource!',
        metadata: await createRole(req.body)
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create Role!',
        metadata: await createResource(req.body)
    }).send(res)
}

const listResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get list Resource!',
        metadata: await resourceList(req.query)
    }).send(res)
}

const listRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get list Role!',
        metadata: await roleList(req.query)
    }).send(res)
}

module.exports = {
    newRole,
    newResource,
    listResource,
    listRole
}