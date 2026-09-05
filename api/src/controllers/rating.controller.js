const Rating = require("../lib/models/rating.model");

const create = async (req, res, next) => {
  try {
    const { mealId, rating } = req.body;

    const ratingDoc = await Rating.create({
      mealId,
      rating,
      user: req.user._id
    });

    res.status(201).json(ratingDoc);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const rating = await Rating.find({
      mealId: req.params.mealId
    });

    res.json(rating);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const ratingDoc = await Rating.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { rating },
      { new: true, runValidators: true }
    );

    if (!ratingDoc) {
      return res.sendStatus(404);
    }

    res.json(ratingDoc);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const ratingDoc = await Rating.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!ratingDoc) {
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
  update,
  deleteItem
};