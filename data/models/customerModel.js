const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');

// Point Schema to update the geolocation of customer
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
  
  
  // Customer schema
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

// the method to generate hash password for new customer
CustomerSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// the method to validate the password when customer sign in
CustomerSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = {
  customer: mongoose.model("customer", CustomerSchema),
};