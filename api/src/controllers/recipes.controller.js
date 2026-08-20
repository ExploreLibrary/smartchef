const axios = require("axios");
const PantryItem = require("../lib/models/pantryItem.model");

const search = async (req, res, next) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`
    );

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const { mealId } = req.params;

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

const checkPantry = async (req, res, next) => {
  try {
    const { mealId } = req.params;

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    const meal = response.data.meals?.[0];

    if (!meal) {
      return res.sendStatus(404);
    }

    const pantryItems = await PantryItem.find({
      user: req.user._id
    });

    const recipeIngredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];

      if (ingredient && ingredient.trim() !== "") {
        recipeIngredients.push(ingredient.trim().toLowerCase());
      }
    }

    const pantryIngredients = pantryItems.map((item) =>
      item.ingredient.trim().toLowerCase()
    );

    const available = recipeIngredients.filter((ingredient) =>
      pantryIngredients.includes(ingredient)
    );

    const missing = recipeIngredients.filter(
      (ingredient) => !pantryIngredients.includes(ingredient)
    );

    res.json({
      mealId: meal.idMeal,
      mealName: meal.strMeal,
      available,
      missing
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
  detail,
  checkPantry
};