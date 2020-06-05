const routes = require('express').Router();

const recipesRoutes = require('./recipes');

routes.use(recipesRoutes);

module.exports = routes;