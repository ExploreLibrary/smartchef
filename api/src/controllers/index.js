const express = require("express");
const usersController = require("./users.controller");
const auth = require("../middlewares/auth.mid");

const router = express.Router();

router.post("/users", usersController.create);

router.post("/sessions", usersController.login);

router.delete("/sessions", auth, usersController.logout);

router.get("/users/me", auth, usersController.profile);

module.exports = router;