const express = require("express");
const menuRouter = express.Router();

const myapi = require("./api");

menuRouter.get("/", async (req, res) => {
  await myapi
    .getMenu()
    .then((data) => {
      res.render("menu", { menu: data[0] });
    })
    .catch((err) => {
      console.log(err);
    });
});

menuRouter.get("/:id", async (req, res) => {
  await myapi
    .getVendorMenu()
    .then((data) => {
      res.render("menu", { menu: data[0] });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = menuRouter;
