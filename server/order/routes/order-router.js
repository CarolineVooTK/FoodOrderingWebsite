const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

router.get("/", orderController.getAll);
router.get("/:id", orderController.getOrderById);
router.post("/createNewOrder", orderController.createNewOrder);

module.exports = router;
