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

const redirectTodashboard = (req, res, next) => {
  // console.log(req.session);
  if (req.session.passport) {
    next();
  } else {
    res.redirect("/customer/login");
  }
};

menuRouter.get("/:id",async (req, res) => {
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
