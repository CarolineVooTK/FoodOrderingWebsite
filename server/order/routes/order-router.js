const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

router.get("/", orderController.getAll);
router.get("/:id", orderController.getOrderById);
router.get("/:vendorId/rating", orderController.getVendorRating);
router.post("/createNewOrder", orderController.createNewOrder);
router.put("/:id/setOrdersFulfilled", orderController.setOrdersFulfilled);

module.exports = router;
