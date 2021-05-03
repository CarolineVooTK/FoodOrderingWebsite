const mongoose = require("mongoose");
// const pointSchema = require("../../vendor/models/Vendor");


// Menu item schema
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
  
  
  // Vendor schema
  const CustomerSchema = new mongoose.Schema(
    {
      familyName: { type: String, required: true },
      givenName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      location: { type: pointSchema, required: false },
    },
    { versionKey: false }
  );

  module.exports = {
    customer: mongoose.model("customer", CustomerSchema),
  };
  
