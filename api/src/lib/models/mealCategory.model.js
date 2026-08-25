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
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      }
    }
  }
);

module.exports = mongoose.model("mealCategory", mealCategorySchema);