const recipesCreate = require("./recipes");

module.exports = () => {
  const recipes = recipesCreate();
  const start = () => {
    console.log("> [core] Starting...");
    recipes.start();
  };

  const stop = () => {
    console.log("> [core] Stoping...");
  };

  return {
    start,
    stop,
  };
};
