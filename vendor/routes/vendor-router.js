const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor-controller");

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

router.get("/", vendorController.getAll);
router.get("/:id", redirectToLogin, vendorController.getVendorById);
router.post("/addVendor", vendorController.addNewVendor);
router.put("/:id/setVendorActive", vendorController.setVendorActive);
router.get("/:id/outstandingOrders", vendorController.getOutstandingOrders);

module.exports = router;
