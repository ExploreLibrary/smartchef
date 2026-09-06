const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: { 
         type :String,
         required: true
         },

        username: { 
         type: String,
         required: true,
         unique: true,
         trim: true
        },

        email:{ 
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
         match: [/^\S+@\S+\.\S+$/, "Invalid email"]
        },

        password: {
         type: String,
         required: true,
         trim: true,
         match: [/^.{8,}$/, "Min 8 characters"]  
        },

         // avatar: String
    },

  {
    timestamps: true,

    toJSON: {
      virtuals: true,

      transform(doc, ret) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
        delete ret.password;
      }
    }
  }
);

userSchema.virtual("pantryItems", {
  ref: "PantryItem",
  localField: "_id",
  foreignField: "user"
});

userSchema.virtual("favorites", {
  ref: "Favorite",
  localField: "_id",
  foreignField: "user"
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);