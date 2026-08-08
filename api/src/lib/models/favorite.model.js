const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    mealId: {
      type: String,
      required: true
    },

    mealName: {
      type: String,
      required: true
    },

    mealThumb: {
      type: String
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Favorite", favoriteSchema);