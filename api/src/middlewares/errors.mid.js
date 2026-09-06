const createError = require("http-errors");
const mongoose = require("mongoose");

const notFound = (req, res, next) => {
  next(createError(404, `Not found - ${req.originalUrl}`));
};

const globalHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, val.message])
    );

    return res.status(400).json({
      message: "Validation error",
      errors
    });
  }

  if (err instanceof mongoose.Error.CastError && err.path === "_id") {
    return res.status(404).json({
      message: "Resource not found"
    });
  }

  const status = err.status || 500;

  req.log.error(err);

  res.status(status).json({
    message: err.message
  });
};

module.exports = { notFound, globalHandler };
