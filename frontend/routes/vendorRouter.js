const express = require("express");
const vendorRouter = express.Router();

const myapi = require("./api");

// redirect middleware, redirect users to login page, if they access pages that requires login
// and not yet login
const redirectToLogin = (req, res, next) => {
  // console.log(req.session);
  if (req.session.passport) {
    next();
  } else {
    res.redirect("/customer/login");
  }
};

vendorRouter.get("/login", (req, res, next) => {
  // console.log(req.session.passport)
  console.log("here")
  // console.log(isVendor)
  res.locals.isVendor = 1;
  console.log(res.locals.isVendor)
  res.render("login");
})

vendorRouter.get("/", async (req, res) => {
  await myapi
    .getAllVendors()
    .then((data) => {
      res.render("vendors", { vendors: data });
    })
    .catch((err) => {
      console.log(err);
    });
});



vendorRouter.get("/:vendorId",redirectToLogin, async (req, res) => {
  await myapi
    .getSingleVendor({ id: req.params.vendorId })
    .then((data) => {
      res.render("vendor", { vendor: data[0] });
    })
    .catch((err) => {
      console.log(err);
    });
});


// Vendors login temp




module.exports = vendorRouter;
