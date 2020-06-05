const routes = require('express').Router();

const homeRoutes = require('./home');

routes.use(homeRoutes);

module.exports = routes;