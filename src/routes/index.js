const routes = require('express').Router();

const adminRoutes = require('./admin');
const publicRoutes = require('./public');

routes.use('/', publicRoutes);
routes.use('/admin', adminRoutes);

module.exports = routes;