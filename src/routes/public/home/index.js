const routes = require('express').Router();

const pj = require('../../../../package.json')

const { baseAPI } = require('../../../utils')

routes.get('/', (_, res) => res.status(200).json(baseAPI(200, `NEXTFOOD API version: ${pj.version}`)));

module.exports = routes;