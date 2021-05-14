const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor-controller");
const passport = require('passport');
require('../../config/passport')(passport);

// redirect middleware, redirect users to login page, if they access pages that requires login
// and not yet login
const redirectToLogin = (req, res, next) => {
  // console.log(req.session);
  if (req.session.passport) {
    next();
  } else {
    res.redirect("/vendors/login");
  }
};

router.get("/login", (req,res) => {
  res.locals.isVendor = true;
  // console.log("res.locals.isVendor")
  res.render("vendorLogin");
})

router.get("/signup", (req,res) => {
  res.locals.isVendor = true;
  // console.log("res.locals.isVendor")
  res.render("vendorSignup");
})

router.post(
  "/login",
  passport.authenticate("local-vendor-login", {
    failureRedirect: "/vendor/login",
    failureFlash: "Incorrect email or password",
  }),function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

router.post(
  "/signup",
  passport.authenticate("local-vendor-signup", {
    failureRedirect: "/vendor/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

router.get("/", vendorController.getAll);
router.get("/:id", redirectToLogin, vendorController.getVendorById);
router.post("/addVendor", vendorController.addNewVendor);
router.put("/:id/setVendorActive", vendorController.setVendorActive);
router.get("/:id/outstandingOrders", vendorController.getOutstandingOrders);


module.exports = router;
