const serverless = require("serverless-http");
const app = require("../../src/app");
const { connectDB } = require("../../src/lib/db");

const handler = serverless(app);

// Netlify keeps the function's process warm between invocations, so the
// mongoose connection created by connectDB() is reused across requests
// instead of being opened from scratch every time.
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectDB();

  return handler(event, context);
};
