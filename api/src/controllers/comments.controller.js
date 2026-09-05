const Comment = require("../lib/models/comments.model");

const create = async (req, res, next) => {
  try {
    const { mealId, comment } = req.body;

    const commentDoc = await Comment.create({
      mealId,
      comment,
      user: req.user._id
    });

    await commentDoc.populate("user", "name username");
    res.json(commentDoc);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      mealId: req.params.mealId
    })
      .populate("user", "name username")
      .sort({ updatedAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { comment } = req.body;

    const commentDoc = await Comment.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { comment },
      { new: true, runValidators: true }
    );

    if (!commentDoc) {
      return res.sendStatus(404);
    }

    await commentDoc.populate("user", "name username");
    res.json(commentDoc);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const commentDoc = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!commentDoc) {
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
