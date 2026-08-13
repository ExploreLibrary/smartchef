const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.error(error);
  process.exit(0);
});