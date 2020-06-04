const databaseCreate = require("../database");
const cheerio = require("cheerio");
const axios = require("axios");
const Recipe = require("../../../app/models/Recipe");
const settings = require("../../../../settings.json");

module.exports = () => {
  const database = databaseCreate();
  const url = settings.base_path;
  const page = 20;

  const start = async () => {
    console.log("> [recipes] Starting...");

    database.start();

    for (let i = 1; i <= page; i++) {
      const recipesUrl = url + "/receitas?page=" + i;
      await getRecipes(recipesUrl);
    }

    console.log("> [recipes] Successfully...");
    process.exit();
  };

  const getRecipes = async (pageUrl) => {
    if (!pageUrl) return console.log("> [getRecipes] Did Not declare url. ");

    const response = await axios.get(pageUrl);

    if ([200, 201].includes(response.status)) {
      console.log("> [recipes] Recipes successfully get.");

      const html = response.data;
      const $ = cheerio.load(html);
      let recipeToList = [];

      $(".recipe-card").each(async (i, element) => {
        return (recipeToList[i] = {
          title: $(element).find(".recipe-title").text().replace(/\n/g, ""),
          image: $(element)
            .find(".recipe-card-img")
            .attr("src")
            .replace(/\n/g, "")
            .split("?")[0],
          likes: parseInt($(element).find(".like").text().replace(/\n/g, "")),
          time: $(element).find(".time").text().replace(/\n/g, ""),
          portion: $(element).find(".portion").text().replace(/\n/g, ""),
          page: $(element).find("div, a").attr("href"),
        });
      });

      const promises = recipeToList.map(async (e) => {
        const recipeDetailUrl = url + e.page;

        const recipeDetail = await getDetailRecipes(recipeDetailUrl);

        if (recipeDetail) {
          const recipe = {
            ...e,
            ingredients: recipeDetail.ingredients,
            instructions: recipeDetail.instructions,
          };

          const recipeExists = await Recipe.findOne({ title: recipe.title });

          if (recipeExists !== null) {
            if (recipeExists) {
              const recipeUpdate = await Recipe.updateOne(
                { title: recipe.title },
                {
                  title: recipe.title,
                  image: recipe.image,
                  likes: recipe.likes,
                  portion: recipe.portion,
                  time: recipe.time,
                  page: recipe.page,
                  ingredients: recipe.ingredients,
                  instructions: recipe.instructions,
                }
              );
              if (recipeUpdate.nModified > 0) {
                return console.log(
                  "> [recipeExists] Recipes successfully updated."
                );
              }
            } else {
              return await Recipe.create(recipe);
            }
          } else {
            return await Recipe.create(recipe);
          }
        }
      });
      return await Promise.all(promises);
    }
  };

  const getDetailRecipes = async (page) => {
    if (!page)
      return console.log("> [getDetailRecipes] Did Not declare page. ");

    const response = await axios.get(page);

    if ([200, 201].includes(response.status)) {
      console.log("> [getDetailRecipes] Recipe Detail successfully get.");

      const html = response.data;
      const $ = cheerio.load(html);
      let recipeDetailToList = [];
      let ingredients = {};
      let instructions = {};

      $(".recipe-container").each(async (i, element) => {
        $(element)
          .find(".ingredients-card > ul > li")
          .each((i, e) => {
            let newIng = $(e).find("span > p").text().replace(/\n/g, "");
            ingredients[i] = newIng;
          });

        $(element)
          .find(".e-instructions > ol > li")
          .each((i, e) => {
            let newInst = $(e).find("span > p").text().replace(/\n/g, "");
            instructions[i] = newInst;
          });

        recipeDetailToList = {
          ingredients,
          instructions,
        };
      });
      return recipeDetailToList;
    }
  };

  return {
    start,
  };
};
