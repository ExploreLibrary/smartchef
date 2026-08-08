const mongoose = require("mongoose");

const pantryItemSchema = new mongoose.Schema(
  {
    ingredient: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    unit: {
      type: String,
      required: true
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

module.exports = mongoose.model("PantryItem", pantryItemSchema);