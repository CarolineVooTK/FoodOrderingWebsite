const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer-controller");
const passport = require("passport");
require("../../config/passport")(passport);
const CustomerModel = require("../models/customerModel");
const { check, validationResult } = require('express-validator');


// the validator for checking customer password and email
// when doing customer registration 
const validation = [
    check('password')
      .exists()
      .isLength({ min: 8 })
      .withMessage('password not valid')
      .matches(/\d/)
      .withMessage('password not valid')
      .matches(/[A-Za-z]/)
      .withMessage('password not valid'),
    check('username')
        .exists()
        .withMessage('username is required')
        .isEmail()
        .withMessage('username not valid'),
];

// the errors handle for customer email and password validation
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  // if there are error
  if (!errors.isEmpty()) {
    var username_error = 0;
    var pass_error = 0;

    // find what kind of error is that
    errors.array().forEach(error =>{
      if (error.msg == "username not valid"){
        username_error += 1;
      }
      else if (error.msg == "password not valid"){
        pass_error += 1;
      }
    })
    // both email and password are invalid
    if (username_error >= 1 && pass_error >= 1){
      return res.render("signup",{email_valid_fail: "Require a valid email", password_valid_fail: true})
    }
    // email is invalid
    else if (username_error >= 1){
      return res.render("signup",{email_valid_fail: "Required a valid email"})
    }
    // password is invalid
    else{
      return res.render("signup",{password_valid_fail: true})
    }
  }
  next();
};

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
  res.render("signup", {
    preEmail: req.query.username,
    signup_message: req.flash("signupMessage"),
  });
});

router.get("/addNewItemInOrder/:snackid/:vendorid",redirectToLogin, customerController.addNewOrderItem);
router.get("/deleteOrderItem/:snackid/:vendorid",redirectToLogin, customerController.deleteOrderItem);

router.get("/logout", (req, res, next) => {
  res.locals.customer_name = null;
  res.locals.vendor_id = null;
  res.locals.type_of_user = null;
  res.locals.customer_id = null;
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

router.get("/profile",customerController.getCustDetails);

router.post(
  "/login",
  passport.authenticate("local-customer-login", {
    failureRedirect: "/customer/login",
    failureFlash: "Incorrect email or password",
  }),
  function (req, res, next) {
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

router.post(
  "/signup",validation, handleValidationErrors,
  passport.authenticate("local-customer-signup", {
    failureRedirect: "/customer/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

module.exports = router;
