const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

const uri = config.get("db.uri");

if (!uri) {
  logger.error('Missing MongoDB URI in configuration (MONGODB_URI)');
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error({ err: error }, 'MongoDB connection error');
    process.exit(1);
  });