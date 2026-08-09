const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("./lib/session");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(session);

app.get("/api/v0/status", (req, res) => {
  res.json({
    status: "ok"
  });
});

module.exports = app;