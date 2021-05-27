const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

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

module.exports = router;
