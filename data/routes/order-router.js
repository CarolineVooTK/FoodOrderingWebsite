const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

const redirectToLogin = (req, res, next) => {
    if (req.session.passport) {
      next();
    } else {
      res.redirect("/vendors/login");
    }
};

router.get("/placeOrder/:vendorid", orderController.placeOrder);
router.get("/cancelSessionOrder", orderController.cancelSessionOrder);
router.get("/:id", orderController.getOrderById);
router.get("/customer/:id", orderController.getAllCustomerOrders);
router.get("/:vendorId/rating", orderController.getVendorRating);
router.patch("/:id/setOrderFulfilled",redirectToLogin, orderController.setOrderFulfilled);
router.patch("/:id/setOrderCollected",redirectToLogin, orderController.setOrderCollected);
router.patch("/:id/setOrderCancelled", orderController.setOrderCancelled);
router.patch("/:id/setOrderRating", orderController.setOrderRating);

module.exports = router;
