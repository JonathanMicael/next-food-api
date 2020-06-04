const Recipe = require("../models/Recipe");
const { baseResponse } = require("../../utils");
module.exports = {
  async index(req, res) {
    const recipes = await Recipe.find({}).sort("-createdAt");

    res.status(200).json(baseResponse(200, "Recipes Succesfuly", recipes));
  },
};
