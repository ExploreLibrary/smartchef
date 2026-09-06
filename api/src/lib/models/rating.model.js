const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    mealId: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
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

ratingSchema.index({ mealId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);