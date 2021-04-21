const mongoose = require("mongoose");
const MenuItemSchema = require("../../menu/models/MenuItem");

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const menuItemsSchema = new mongoose.Schema(
  {
    menuitem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// schema
const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: pointSchema, required: false },
    textlocation: { type: String, required: false },
    active: { type: Boolean, required: false },
    description: { type: String, required: false },
    rating: { type: Number, required: false },
    orders: { type: [mongoose.Schema.Types.ObjectId], required: false },
    menu: { type: [menuItemsSchema], required: false },
  },
  { versionKey: false }
);

// model from schema
module.exports = {
  vendors: mongoose.model("vendors", VendorSchema),
  point: mongoose.model("point", pointSchema),
};
