const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer-controller");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
require('../../config/passport')(passport);
const CustomerModel = require("../models/customerModel");
const customer = CustomerModel.customer;
const bcrypt = require("bcrypt-nodejs");

// router.post("/custAuth", customerController.customerAuth);
// router.post("/addcustomer", customerController.addNewCustomer);

const redirectToLogin = (req, res, next) => {
  console.log(req.session);
  if (req.session.passport) {
    next();
  } else {
    res.redirect("/customer/login");
  }
};

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/signup", (req, res, next) => {
  res.render("signup", { preEmail: req.query.username ,signup_message : req.flash("signupMessage")});
});



router.get("/logout", (req, res, next) => {
  res.locals.customer_name = null;
  res.locals.customer_id = null;
  req.session.destroy(function (err) {
    res.redirect("/"); //Inside a callback… bulletproof!
  });
});

router.get("/profile", redirectToLogin, (req, res, next) => {
  res.render("profile");
});

router.post(
  "/login",
  passport.authenticate("local-customer-login", {
    failureRedirect: "/customer/login",
    failureFlash: "Incorrect email or password",
  }),function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

router.post(
  "/signup",
  passport.authenticate("local-customer-signup", {
    failureRedirect: "/customer/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

module.exports = router;
