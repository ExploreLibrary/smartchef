const express = require("express");
const usersController = require("./users.controller");
const auth = require("../middlewares/auth.mid");
const pantryItemsController = require("./pantryItems.controller");
const favoritesController = require("./favorites.controller");

const router = express.Router();

router.post("/users", usersController.create);
router.post("/users/login", usersController.login);
router.delete("/users/logout", auth, usersController.logout);
router.get("/users/profile", auth, usersController.profile);

router.get("/pantry", auth, pantryItemsController.list);
router.post("/pantry", auth, pantryItemsController.create);
router.get("/pantry/:id", auth, pantryItemsController.detail);
router.patch("/pantry/:id", auth, pantryItemsController.update)
router.delete("/pantry/:id", auth, pantryItemsController.deleteItem);

router.get("/favorites", auth, favoritesController.list);
router.post("/favorites", auth, favoritesController.create);
router.get("/favorites/:id", auth, favoritesController.detail);
router.delete("/favorites/:id", auth, favoritesController.deleteItem);

module.exports = router;