const express = require("express");
const usersController = require("./users.controller");
const auth = require("../middlewares/auth.mid");
const pantryItemsController = require("./pantryItems.controller");
const favoritesController = require("./favorites.controller");
const recipesController = require("./recipes.controller");
const mealCategoriesController = require("./mealCategories.controller");
const ratingController = require("./rating.controller");
const commentsController = require("./comments.controller");

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

router.get("/recipes/search", recipesController.search);
router.get("/recipes/:mealId/check-pantry", auth, recipesController.checkPantry);
router.get("/recipes/:mealId", recipesController.detail);

router.get("/meal-categories/:category", auth, mealCategoriesController.search);

router.get("/ratings/:mealId", auth, ratingController.list);
router.post("/ratings", auth, ratingController.create);
router.patch("/ratings/:id", auth, ratingController.update);
router.delete("/ratings/:id", auth, ratingController.deleteItem);

router.get("/comments/:mealId", auth, commentsController.list);
router.post("/comments", auth, commentsController.create);
router.patch("/comments/:id", auth, commentsController.update);
router.delete("/comments/:id", auth, commentsController.deleteItem);




module.exports = router;