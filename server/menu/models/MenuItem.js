const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, required: true },
    price: { type: Number, required: true },
    ingredients: { type: [String], required: true },
    description: { type: String, required: false },
  },
  { _id: false }
);

module.exports = {
  menuitems: mongoose.model("menuitems", MenuItemSchema),
};
