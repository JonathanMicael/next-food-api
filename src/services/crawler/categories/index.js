const databaseCreate = require("../database");
const cheerio = require("cheerio");
const axios = require("axios");
const Category = require("../../../app/models/Category");
const settings = require("../../../../settings.json");


module.exports = () => {
  const database = databaseCreate();
  const url = settings.base_path;

  const start = async () => {
    console.log("> [categories] Starting...");

    database.start();

    const recipesUrl = url + "/categorias";

    await getCategories(recipesUrl);

    console.log("> [categories] Successfully...");
    process.exit();
  };

  const getCategories = async (pageUrl) => {
    if (!pageUrl) return console.log("> [getCategories] Did Not declare url. ");

    const response = await axios.get(pageUrl);

    if ([200, 201].includes(response.status)) { 
      console.log("> [categories] Categories successfully get.");

      const html = response.data;
      const $ = cheerio.load(html);
      let categoriesToList = [];
      let classifications = [];
      $(".row > .card").each(async (i, element) => {

        $(element)
        .find("div > h3")
        .each((i, e) => {
          let newClassifications = {
            title: $(e).find("a").text().replace(/\n/g, ""),
            url: $(e).find("a").attr("href")
          };
          classifications[i] = newClassifications;
        });

        return categoriesToList[i] = {
          title: $(element).find("a > .box-title").text().replace(/\n/g, ""),
          allRecipes: parseInt($(element).find(".num").text().replace(/\D+/g, "")),
          url: $(element).find(".page-title > a").attr("href"),
          classifications: classifications,
        };
      });
    
      const promises = categoriesToList.map(async (category) => {

        const categoryExists = await Category.findOne({ title: category.title });
        if(categoryExists !== null) {
          if (categoryExists) {
            const categoryUpdate = await Category.updateOne(
              { title: category.title },
              {
                title: category.title,
                allRecipes: category.allRecipes,
                url: category.url,
                classifications: category.classifications,
              }
            );
            if (categoryUpdate.nModified > 0) {
              return console.log(
                "> [categoryExists] Category '"+ category.title +"' successfully updated."
              );
            }
          }
          else {
            return await Category.create(category);
          }
        } else {
          return await Category.create(category);
        }
      })

      return await Promise.all(promises);
    }
  };

  return {
    start
  }
}