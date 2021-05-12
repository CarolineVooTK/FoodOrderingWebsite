const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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



  CustomerSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


  module.exports = {
    customer: mongoose.model("customer", CustomerSchema),
  };
  
