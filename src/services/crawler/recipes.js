const prompts = require('prompts');
const allRecipes = require('./allRecipes');
const categories = require('./categories');

module.exports = () => {
  const recipes = allRecipes();
  const category = categories();

  const start = async () => {
    console.log("> [recipes] Starting...");

    console.log("> [allRecipes] Starting...");

    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Qual você quer fazer o seed?',
      choices: [
        { title: 'Receitas', value: 'Recipes' },
        { title: 'Categorias', value: 'Categories' },
      ],
    });

   if(response.value === 'Recipes')
      await recipes.start();
   else if (response.value === 'Categories')
      await category.start();
   else 
     console.log("> [recipes] Sua escolha não está disponível. :(")

    console.log("> [recipes] Successfully...");
    process.exit();
  };

  return {
    start,
  };
};
