const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor-controller");

router.get("/", vendorController.getAll);
router.get("/:id", vendorController.getVendorById);
router.post("/addVendor", vendorController.addNewVendor);
router.put("/:id/setVendorActive", vendorController.setVendorActive);
router.get("/:id/outstandingOrders", vendorController.getOutstandingOrders)

module.exports = router;