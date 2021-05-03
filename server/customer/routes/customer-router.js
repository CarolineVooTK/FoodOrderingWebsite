const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer-controller");

router.post("/custAuth", customerController.customerAuth);
router.post("/addcustomer", customerController.addNewCustomer);

module.exports = router;