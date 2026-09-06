const PantryItem = require("../lib/models/pantryItem.model");

const create = async (req, res, next) => {
  try {
    const { ingredient, quantity, unit } = req.body;

    const pantryItem = await PantryItem.create({
      ingredient,
      quantity,
      unit,
      user: req.user._id
    });

    res.status(201).json(pantryItem);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const pantryItems = await PantryItem.find({
      user: req.user._id
    });

    res.json(pantryItems);
  } catch (error) {
    next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const pantryItem = await PantryItem.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!pantryItem) {
      return res.status(404).json({
        message: "Pantry item not found"
      });
    }

    res.json(pantryItem);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const pantryItem = await PantryItem.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!pantryItem) {
      return res.status(404).json({
        message: "Pantry item not found"
      });
    }

    res.json(pantryItem);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const pantryItem = await PantryItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!pantryItem) {
      return res.status(404).json({
        message: "Pantry item not found"
      });
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
  update,
  deleteItem
};