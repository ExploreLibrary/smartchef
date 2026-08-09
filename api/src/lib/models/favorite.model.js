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
    timestamps: true,

    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

module.exports = mongoose.model("Favorite", favoriteSchema);