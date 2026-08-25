const mongoose = require("mongoose");

const mealCategorySchema = new mongoose.Schema(
  {
    mealName: {
      type: String,
      required: false
    },

    mealThumb: {
      type: String,
      required: false
    },

    externalId: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
         toJSON: {
      transform(doc, ret) {
        ret.mealName = ret.strMeal;
        ret.mealThumb = ret.strMealThumb;
        ret.externalId = ret.id;
        ret.country = ret.strCountry;

        delete ret.strArea;
      }
    }
  } 

);

module.exports = mongoose.model("mealCategory", mealCategorySchema);