const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

// router.get("/", orderController.getAll);
router.get("/placeOrder/:vendorid", orderController.placeOrder);
router.get("/cancelSessionOrder", orderController.cancelSessionOrder);
router.get("/:id", orderController.getOrderById);
router.get("/customer/:id", orderController.getAllCustomerOrders);
router.get("/:vendorId/rating", orderController.getVendorRating);
router.post("/createNewOrder", orderController.createNewOrder);
router.patch("/:id/setOrderFulfilled", orderController.setOrderFulfilled);
router.patch("/:id/setOrderCollected", orderController.setOrderCollected);
router.patch("/:id/setOrderCancelled", orderController.setOrderCancelled);
router.patch("/:id/setOrderRating", orderController.setOrderRating);

// get the cart
router.get("/cart", function (req, res) {
  // to check if there is a cart at the moment
  if (!req.session.cart) {
    return res.render("vendor", { items: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("vendor", {
    items: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQuantity: cart.totalQuantity,
  });
});

module.exports = router;
