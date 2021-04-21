const express = require("express");
const router = express.Router();
const MenuController = require("../controllers/menu-controller");

router.get("/", MenuController.getAll);

module.exports = router;
