const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    mealId: {
      type: String,
      required: true
    },

    comment: {
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

module.exports = mongoose.model("Comment", commentSchema);