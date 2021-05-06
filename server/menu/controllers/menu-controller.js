const MenuModel = require("../models/MenuItem");

// import menu model
const menuitems = MenuModel.menuitems;
let ObjectId = require("mongoose").Types.ObjectId;

var Cart = require('../models/cart'); // create cart.js in model 

// get all snacks
const getAllSnacks = async (req, res) => {
  try {
    const snacks = await menuitems.find({});
    return res.send(snacks);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

//get one snack by their id
const getOneSnack = async (req, res) => {
  try {
    const oneSnack = await menuitems.findOne({ _id: req.params.snackId });
    if (oneSnack === null) {
      //no snack found in database
      res.status(404);
      return res.send("Snack not found");
    }
    return res.send(oneSnack); //Snack was found
  } catch (err) {
    //error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// adding an item into cart if it is not in the cart
const addNewItemInOrder = async (req, res) => {
   var itemId = req.params.snackId; 
   // create a new cart whenever a new item is added in 
   var cart = new Cart(req.session.cart ? req.session.cart : {}) ; 

  menuitems.findone({_id : req.params.snackId}, function(err, item){
    if (err) {
      // Or maybe we can add a pop out showing error message 
      // Redirect to the menu page if there is an error
      return res.send("Error while adding the snack into Cart")
    }
    // pass the snack that just fetch from the database 
    // and snack id as the identifier
    cart.add(item, item.id);
    // storing in cart object in my session
    req.session.cart = cart;
    console.log(req.session.cart); 
    res.redirect('/') // redirect back to menu page after adding an item into the cart  
  })
}

// export the functions
module.exports = {
  getAllSnacks,
  getOneSnack,
  addNewItemInOrder 
};
