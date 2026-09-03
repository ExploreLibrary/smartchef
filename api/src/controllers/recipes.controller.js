const axios = require("axios");
const PantryItem = require("../lib/models/pantryItem.model");

const areas = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );

    res.json({
      areas: response.data.meals?.map((meal) => meal.strArea) ?? []
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const category = (req.query.category || "").trim();
    const country = (req.query.country || "").trim();
    const ingredient = (req.query.ingredient || "").trim();

    let meals = [];

    // --------------------------------
    // 1. Initial search
    // --------------------------------

    if (q) {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`
      );

      meals = response.data.meals ?? [];
    } else if (ingredient) {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
      );

      meals = response.data.meals ?? [];
    } else if (category) {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
      );

      meals = response.data.meals ?? [];
    } else if (country) {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(country)}`
      );

      meals = response.data.meals ?? [];
    } else {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );

      meals = response.data.meals ?? [];
    }

    // --------------------------------
    // 2. Get full details when
    //    multiple filters are used
    // --------------------------------

    const hasMultipleFilters =
      (q && (category || country || ingredient)) ||
      (category && (country || ingredient)) ||
      (country && ingredient);

    if (hasMultipleFilters) {
      const detailedMeals = await Promise.all(
        meals.map(async (meal) => {
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );

          return response.data.meals?.[0];
        })
      );

      meals = detailedMeals.filter(Boolean);
    }

    // --------------------------------
    // 3. Category filter
    // --------------------------------

    if (category) {
      meals = meals.filter(
        (meal) => meal.strCategory === category
      );
    }

    // --------------------------------
    // 4. Country filter
    // --------------------------------

    if (country) {
    meals = meals.filter(
      (meal) =>
      meal.strArea === country ||
      (country === "Indian" && meal.strArea === "India")
      );
    }

    // --------------------------------
    // 5. Ingredient filter
    // --------------------------------

    if (ingredient) {
      const ingredientSearch = ingredient.trim().toLowerCase();

      meals = meals.filter((meal) => {
        for (let i = 1; i <= 20; i++) {
          const mealIngredient = meal[`strIngredient${i}`];

          if (
            mealIngredient &&
            mealIngredient.trim().toLowerCase().includes(ingredientSearch)
          ) {
            return true;
          }
        }

        return false;
      });
    }

    // --------------------------------
    // 6. Response
    // --------------------------------

    res.json({
      meals
    });

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
        recipeIngredients.push(
          ingredient.trim().toLowerCase()
        );
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
  areas,
  search,
  detail,
  checkPantry
};