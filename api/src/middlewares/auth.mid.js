const createError = require("http-errors");
const User = require("../lib/models/user.model");

const auth = async (req, res, next) => {

  try {
    if (!req.session.userId) {
      return next(createError(401, "Session not found"));
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return next(createError(401, "Session user not found"));
    }

    req.user = user;

    next();

  } catch (err) {
    next(err);
  }
};

module.exports = auth;