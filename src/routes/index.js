const routes = require('express').Router();
const pj = require('../../package.json')

const { baseAPI } = require('../utils')

const RecipeController = require('../app/controllers/RecipeController')

routes.get('/', (_, res) => res.status(200).json(baseAPI(200, `NEXTFOOD API version: ${pj.version}`)));

// Recipes
routes.get('/recipes', RecipeController.index)



module.exports = routes;