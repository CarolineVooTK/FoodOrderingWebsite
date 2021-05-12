const MenuModel = require("../models/MenuItem");

// import menu model
const menuitems = MenuModel.menuitems;
let ObjectId = require("mongoose").Types.ObjectId;

var Cart = require("../models/Cart.js"); // create cart.js in model

// get all snacks
const getAllSnacks = async (req, res) => {
  await menuitems
    .find({})
    .lean()
    .then((data) => {
      res.render("menu", { menu: data });
    })
    .catch((err) => {
      console.log(err);
    });
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
    var itemId = data._id;
    var itemName = data.name;
    var itemPrice = data.price;
    //create a new cart whenever a new item is added in
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    // pass the snack that fetch from database and id as the identifier
    cart.add(itemName, itemId, itemPrice);
    // storing in cart object in my session
    req.session.cart = cart;
    console.log(req.session.cart);
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
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  menuitems.findone({ _id: req.params.snackId }, function (err, item) {
    if (err) {
      // Or maybe we can add a pop out showing error message
      // Redirect to the menu page if there is an error
      return res.send("Error while adding the snack into Cart");
    }
    // pass the snack that just fetch from the database
    // and snack id as the identifier
    cart.add(item, item.id);
    // storing in cart object in my session
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/"); // redirect back to menu page after adding an item into the cart
  });
};

// export the functions
module.exports = {
  getAllSnacks,
  getOneSnack,
  addNewItemInOrder,
};
