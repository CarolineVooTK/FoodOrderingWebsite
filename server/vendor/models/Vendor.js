const mongoose = require("mongoose");

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

// schema
const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    location: { type: pointSchema, required: false },
    active: { type: Boolean, required: false },
    description: { type: String, required: false },
    rating: { type: String, required: false },
    orders: { type: Array, required: false },
    menu: { type: Array, required: false },
    inventory: { type: Array, required: false },
  },
  { versionKey: false }
);

// model from schema
module.exports = {
  vendors: mongoose.model("vendors", VendorSchema),
  point: mongoose.model("point", pointSchema),
};
