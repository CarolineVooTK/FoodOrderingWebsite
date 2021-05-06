const express = require("express");
const orderRouter = express.Router();

const myapi = require("./api");

// redirect middleware, redirect users to login page, if they access pages that requires login
// and not yet login
const redirectToLogin = (req, res, next) => {
  // console.log(req.session);
  if (req.session.passport) {
    next();
  } else {
    res.redirect("/customer/login");
  }
};

orderRouter.get("/", async (req, res) => {
    await myapi
      .getOrders()
      .then((data) => {
        res.render("orders", { orders: data });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  
  orderRouter.get("/:id",async (req, res) => {
    await myapi
      .getOrderDetails()
      .then((data) => {
        res.render("orders", { order: data[0] });
      })
      .catch((err) => {
        console.log(err);
      });
  });

module.exports = orderRouter;