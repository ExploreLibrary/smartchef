const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const config = require("./config");

module.exports = session({
  secret: config.get("session.secret"),
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: config.get("db.uri") }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: config.get("session.secure"),
  },
});