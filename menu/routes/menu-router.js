const express = require("express");
// add our router
const menuRouter = express.Router();

//require the menu controller
const menuController = require("../controllers/menu-controller");

//handle the GET request to get all snacks from menu
menuRouter.get("/", (req, res) => menuController.getAllSnacks(req, res));

//handle the GET request to get one snack
menuRouter.get("/:snackId", (req, res) => menuController.getOneSnack(req, res));
// menuRouter.get("/vendor/:snackId", (req, res) => menuController.getVendorMenu(req, res));

// handle the get request to add snack to order details
menuRouter.get("/addNewItemInOrder/:snackId", menuController.addNewItemInOrder);
menuRouter.get("/getCart", menuController.getCart);
menuRouter.post("/checkOut", menuController.checkOut);

module.exports = menuRouter;
