const Rating = require("../lib/models/rating.model");

const create = async (req, res, next) => {
  try {
    const { mealId, rating } = req.body;

    const ratingDoc = await Rating.findOneAndUpdate(
      {
        mealId,
        user: req.user._id
      },
      { rating },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    await ratingDoc.populate("user", "name username");
    res.json(ratingDoc);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const ratings = await Rating.find({
      mealId: req.params.mealId
    })
      .populate("user", "name username")
      .sort({ updatedAt: -1 });

    const usersWithRating = new Set();
    const uniqueRatings = ratings.filter((ratingDoc) => {
      const userId = ratingDoc.user?._id?.toString() || ratingDoc.id;

      if (usersWithRating.has(userId)) {
        return false;
      }

      usersWithRating.add(userId);
      return true;
    });

    res.json(uniqueRatings);
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