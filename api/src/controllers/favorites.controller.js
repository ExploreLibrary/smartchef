const Favorite = require("../lib/models/favorite.model");

const create = async (req, res, next) => {
  try {
    const { mealId, mealName, mealThumb } = req.body;

    const favorite = await Favorite.create({
      mealId,
      mealName,
      mealThumb,
      user: req.user._id
    });

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id
    });

    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!favorite) {
      return res.sendStatus(404);
    }

    res.json(favorite);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!favorite) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
  detail,
  deleteItem
};