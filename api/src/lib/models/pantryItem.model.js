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

module.exports = mongoose.model("PantryItem", pantryItemSchema);