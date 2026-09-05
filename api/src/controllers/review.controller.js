const Favorite = require("../lib/models/review.model");

const create = async (req, res, next) => {
  try {
    const { mealId, rating } = req.body;

    const review = await Review.create({
      mealId,
      rating,
      user: req.user._id
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const review = await Review.find({
      mealId: req.params.mealId
    });

    res.json(review);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
    try {
    const review = await Review.findOneAndUpdate(
        {
            _id: req.params.id,
             user: req.user._id,
             rating
        }
    );
    if (!review) {
      return res.sendStatus(404);
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
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