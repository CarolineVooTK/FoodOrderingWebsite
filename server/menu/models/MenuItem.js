const mongoose = require("mongoose");

// Menu item schema
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  description: { type: String, required: false },
});

const menuitems = mongoose.model("menuitems", MenuItemSchema);
module.exports = { menuitems };
