const routes = require('express').Router();

const RecipeController = require('../../../app/controllers/Admin/RecipesController')

/**
 * Routes Recipe Admin
 */
routes.get('/recipes', RecipeController.index);
routes.post('/recipe', RecipeController.store);

module.exports = routes;