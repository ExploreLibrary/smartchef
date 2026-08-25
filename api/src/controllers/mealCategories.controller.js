const axios = require("axios");

const search = async (req, res, next) => {
  try {
    const { category } = req.params;

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );

    const categories = (response.data.meals || []).map((meal) => ({
      mealName: meal.strMeal,
      mealThumb: meal.strMealThumb,
      externalId: meal.idMeal,
      country: meal.strCountry
    }));

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
};