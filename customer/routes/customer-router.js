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

// passport.use(
//   "local-signup",
//   new LocalStrategy({ passReqToCallback: true }, function (req, givenName, familyName, done) {
//     let input = {
//       givenName: req.body.givenName,
//       familyName: req.body.familyName,
//       username: req.body.username,
//       password: req.body.password,
//     };
//     let ress = "";
//     customerController
//       .addNewCustomer(input, res)
//       .then((data) => {
//         // console.log("herre")
//         // console.log(data)
//         if (data) {
//           req.session.email = req.body.username;
//           return done(null, data);
//         } else {
//           return done(null, false, {
//             message: `Invalid Information`,
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
// );

// passport.serializeUser(function (user, done) {
//   // console.log("serialize")
//   // console.log("user = ", user)
//   done(null, user._id);
// });

// passport.deserializeUser(function (obj, done) {
//   // console.log("unserialize")
//   done(null, obj);
// });

module.exports = router;
