const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    allRecipes: {
      type: Number,
    },
    classifications: [{
      title: String,
      url: String,
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Categories", CategorySchema);
