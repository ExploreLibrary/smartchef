const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

let connectionPromise = null;

// Reuses the existing connection (or in-flight connection attempt) instead of
// opening a new one every call. This matters for Netlify Functions, where the
// module can stay warm across invocations and reconnecting each time would be
// wasteful (and can exhaust the connection pool).
function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = config.get("db.uri");

  if (!uri) {
    return Promise.reject(new Error("Missing MongoDB URI in configuration (MONGODB_URI)"));
  }

  connectionPromise = mongoose
    .connect(uri)
    .then(() => {
      logger.info("Connected to MongoDB");
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      logger.error({ err: error }, "MongoDB connection error");
      throw error;
    });

  return connectionPromise;
}

module.exports = { connectDB };
