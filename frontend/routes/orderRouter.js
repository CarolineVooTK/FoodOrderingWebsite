const express = require("express");
const orderRouter = express.Router();

const myapi = require("./api");

// import menu model
const MenuModel = require("../../server/menu/models/MenuItem"); 
const menuitems = MenuModel.menuitems;
let ObjectId = require("mongoose").Types.ObjectId;

const Cart = require('../routes/Cart'); 


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

// adding item into cart if it is not in cart & add quantity if already in cart 
orderRouter.get("/addNewItemInOrder/:snackId", async (req, res) => {
    await myapi
      .getMenuById(req.params.snackId)
      .then((data) => {
        var itemId = data._id
        var itemName = data.name
        var itemPrice = data.price
        //create a new cart whenever a new item is added in 
        var cart = new Cart(req.session.cart ? req.session.cart : {}) 

        // pass the snack that fetch from database and id as the identifier 
        cart.add(itemName, itemId, itemPrice) ; 
        // storing in cart object in my session 
        req.session.cart = cart;
        console.log(req.session.cart); 
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
// get the cart 
orderRouter.get("/cart", function(req, res) {
  // to check if there is a cart at the moment 
  if (!req.session.cart) {
    return res.render('vendor', {items : null}); 
  }
  var cart = new Cart(req.session.cart);
  res.render('vendor', {items: cart.generateArray(), totalPrice : cart.totalPrice, totalQuantity: cart.totalQuantity})
});

module.exports = orderRouter;
