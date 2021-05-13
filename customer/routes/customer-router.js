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
  // console.log(req.session.passport)
  res.render("login");
});

router.get("/signup", (req, res, next) => {
  // console.log(req.session.passport)
  // console.log(req)
  res.render("signup", { preEmail: req.query.username });
});

// router.post("/register")

router.get("/logout", (req, res, next) => {
  // console.log(req.session.passport)
  res.locals.customer_name = null;
  res.locals.customer_id = null;
  req.session.destroy(function (err) {
    res.redirect("/"); //Inside a callback… bulletproof!
  });
});

router.get("/profile", redirectToLogin, (req, res, next) => {
  // console.log(req.session.passport)
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
  // function (req, res, next) {
  //   // console.log("user",req.user);
  //   req.flash("success", "Login Success..");
  //   res.redirect("/");
  // }
);

// passport.use(
//   "local-login",
//   new LocalStrategy({ passReqToCallback: true }, async function (req, username, password, done) {
//     // let input = { username: req.body.username, password: req.body.password };
//     // req.body.email = username
//     // req.body.password = password
//     await customer
//       .findOne({ email: req.body.username })
//       .lean()
//       .then((data) => {
//         if (!data) {
//           return done(null, false, {
//             message: `Customer not found`,
//           });
//         }
//         if (bcrypt.compare(data.password, req.body.password)) {
//           req.session.email = req.body.username;
//           return done(null, data);
//         }
//         return done(null, false, {
//           message: `Invalid Username or password`,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
// );

// router.post(
//   "/signup",
//   passport.authenticate("local-signup", {
//     failureRedirect: "/customer/signup",
//     failureFlash: true,
//   }),
//   function (req, res, next) {
//     // console.log("user",req.user);
//     req.flash("success", "Login Success..");
//     res.redirect("/");
//   }
// );

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
