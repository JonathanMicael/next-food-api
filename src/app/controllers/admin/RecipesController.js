const Recipe = require('../../models/Recipe');
const { baseResponse } = require("../../../utils");

/**
 * This Controller is reponsable for the recipes operations related to the admin role
 */
class RecipesAdminController {
  /**
   * Return a List with Recipes sort created at.
   * @param {*} res 
   */
  async index(req, res) {
    try {
        const recipes = await Recipe.find({}).sort("-createdAt");
        return res.status(200).json(baseResponse(200, "Recipes Succesfuly", {}, { data: recipes }));
    } catch (err) {
      console.log(err)
        return res.status(400).json(baseResponse(400, "Could not list recipes", {}, { data: [], error: err}));
    }
  }

  async store(req, res) {

    try {
      const { title, image, likes, portion, time, page, ingredients, instructions } = req.body;

      if (await Recipe.findOne({ title })) {
        return res.json(baseResponse(400, "User already exists", {}, { data: [], error: 'User already exists'}));
      }

      const recipe = await Recipe.create({
        title,
        image,
        likes,
        portion,
        time,
        page,
        ingredients,
        instructions
      })

      return res.json(baseResponse(200, "Recipes Succesfuly created", {}, { data: recipe }));
    } catch (err) {
      console.log(err)
      return res.status(400).json(baseResponse(400, "Could not list recipes", {}, { data: [], error: err.errors}));
    }
  } 
}

module.exports = new RecipesAdminController();