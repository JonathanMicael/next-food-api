const { Schema, model } = require("mongoose");

const RecipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    likes: Number,
    portion: String,
    time: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Object,
    },
    instructions: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Recipes", RecipeSchema);
