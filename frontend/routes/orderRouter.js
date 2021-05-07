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

// get all orders for a single customer
orderRouter.get("/customer/:id", async (req, res) => {
  await myapi
    .getCustomerOrders({ id: req.params.id })
    .then((data) => {
      console.log(data);
      res.render("orders", { orders: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

// get details for a single order
orderRouter.get("/:id", async (req, res) => {
  await myapi
    .getOrderDetails({ id: req.params.id })
    .then((data) => {
      res.render("orders", { order: data[0] });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = orderRouter;
