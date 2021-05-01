const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer-controller");

router.post("/custAuth", customerController.customerAuth);

module.exports = router;