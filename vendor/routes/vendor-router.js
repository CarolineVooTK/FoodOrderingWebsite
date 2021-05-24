const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor-controller");
const passport = require("passport");
require("../../config/passport")(passport);

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
const redirectToCustomerLogin = (req, res, next) => {
  // console.log(req.session);
  if (req.session.passport) {
    next();
  } else {
    res.redirect("/customer/login");
  }
};

router.get("/login", (req, res) => {
  res.locals.isVendor = true;
  // console.log("res.locals.isVendor")
  res.render("vendorLogin");
});

router.get("/signup", (req, res) => {
  res.locals.isVendor = true;
  // console.log("res.locals.isVendor")
  res.render("vendorSignup", { signup_message: req.flash("signupMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-vendor-login", {
    failureRedirect: "/vendors/login",
    failureFlash: "Incorrect email or password",
  }),
  function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

router.post(
  "/signup",
  passport.authenticate("local-vendor-signup", {
    failureRedirect: "/vendors/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    // console.log("user",req.user);
    req.flash("success", "Login Success..");
    res.redirect("/");
  }
);

router.get("/profile", redirectToLogin, vendorController.getStatus);
router.get("/setoff", redirectToLogin, vendorController.setVendorOff);
router.post("/setActive", redirectToLogin, vendorController.setVendorActive);
router.get("/", vendorController.getAll);
router.get("/:id", redirectToCustomerLogin, vendorController.getVendorById);
router.post("/addVendor", vendorController.addNewVendor);
// router.put("/:id/setVendorActive", vendorController.setVendorActive);
router.get("/:id/outstandingOrders", vendorController.getOutstandingOrders);
router.get("/getOutsOrdersByVendor", vendorController.getOutsOrdersByVendor); 
router.get("/getPastOrdersByVendor", vendorController.getPastOrdersByVendor); 

module.exports = router;
