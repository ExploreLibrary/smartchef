const createError = require("http-errors");

const notFound = (req, res, next) => {
  next(createError(404, `Not found - ${req.originalUrl}`));
};

const globalHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  if (req.log) {
    req.log.error({ err }, err.message);
  } else {
    console.error(err);
  }

  res.status(status).json({
    error: {
      status,
      message: createError.isHttpError(err) ? err.message : "Internal server error",
    },
  });
};

module.exports = { notFound, globalHandler };
