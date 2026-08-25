const app = require("./app");
require("./lib/db");
const config = require("./lib/config");
const logger = require("./lib/logger");

const port = config.get("port");

const server = app.listen(port, () => {
  logger.info(`Server listening at port ${port}`);
});

server.on("error", (err) => {
  logger.error({ err }, 'Server error');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception');
  process.exit(1);
});