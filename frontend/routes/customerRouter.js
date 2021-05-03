const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const customerRouter = express.Router();

const myapi = require("./api");

// redirect middleware, redirect users to login page, if they access pages that requires login
// and not yet login
const redirectToLogin = (req, res, next) => {
  console.log(req.session);
  if (req.session.passport) {
    next();
  } else {
    res.redirect("/customer/login");
  }
};

customerRouter.get("/login", (req, res, next) => {
  // console.log(req.session.passport)
  res.render("login");
});

customerRouter.get("/signup", (req, res, next) => {
  // console.log(req.session.passport)
  // console.log(req)
  res.render("signup", {preEmail: req.query.username});
});

// customerRouter.post("/register")

customerRouter.get("/logout", (req, res, next) => {
  // console.log(req.session.passport)
  res.locals.customer_name = null;
  res.locals.customer_id = null;
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});


customerRouter.get("/profile",redirectToLogin, (req, res, next) => {
  // console.log(req.session.passport)
  res.render("profile");
});


customerRouter.post(
  "/login",
  passport.authenticate("local-login", {
    failureRedirect: "/customer/login",
    failureFlash: "Incorrect email or password",
  }),
  function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

passport.use(
  "local-login",
  new LocalStrategy( {passReqToCallback : true}, function (req,username, password, done) {
    let input = { username: req.body.username, password: req.body.password };
    // req.body.username = username
    // req.body.password = password
    let res = "";
    myapi
      .customerAuth(input, res)
      .then((data) => {
        // console.log("herre")
        // console.log(data)
        if (data) {
          return done(null, data.data);
        } else {
          return done(null, false, {
            message: `Invalid Username or password`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
);



customerRouter.post(
  "/signup",
  passport.authenticate("local-signup", {
    failureRedirect: "/customer/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

passport.use(
  "local-signup",new LocalStrategy( {passReqToCallback : true},function (req,givenName, familyName, done) {
    let input = { givenName:req.body.givenName, familyName: req.body.familyName,
                   username: req.body.username, password: req.body.password };
    let ress = "";
    myapi
      .addNewCustomer(input, ress)
      .then((data) => {
        // console.log("herre")
        // console.log(data)
        if (data) {
          return done(null, data);
        } else {
          return done(null, false, {
            message: `Invalid Information`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
);


passport.serializeUser(function (user, done) {
  // console.log("serialize")
  // console.log("user = ", user)
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  // console.log("unserialize")
  done(null, obj);
});

module.exports = customerRouter;
