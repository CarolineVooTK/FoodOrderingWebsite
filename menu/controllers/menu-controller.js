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
  } catch (err) {
    //error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// adding an item into cart(order) if it is not in the cart(order)
const addNewItemInOrder = async (req, res) => {
  // create a new cart whenever a new item is added in
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  await menuitems
  .findOne({ _id: req.params.snackId })
  .then((data) => {
    var itemId = data._id;
    var itemName = data.name;
    var itemPrice = data.price;
    //create a new cart whenever a new item is added in
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    // Get the current URL of the window and only take the last segment (which is id of vendors) 
    // in order to redirect back to the page after clicking add to cart button 
    //var currentVendorId = window.location.pathname.split("/").pop()

    // pass the snack that fetch from database and id as the identifier
    cart.add(itemName, itemId, itemPrice);
    // storing in cart object in my session
    req.session.cart = cart;
    console.log(req.session.cart);
    //console.log(document.location.pathname.split("/").pop());
    res.redirect('/vendors/');
  })
  .catch((error) => {
    res.status(500).json({
    error: error,
    });
  });
};

// get the cart item
const getCart = async (req, res) => {
  // to check if there is a cart at the moment 
  if (!req.session.cart) {
    console.log("No Items in the Cart");
    // need the vendor id after the /vandors/
    return res.render('/vendors/', {items : null}); 
  }
  var cart = new Cart(req.session.cart);
  res.render('/vendors/', {items: cart.generateArray(), totalPrice : cart.totalPrice, totalQuantity: cart.totalQuantity})
};

// this function should be in the hbs file. 
function addToLocalStorage() {
  // create an array as a cart if does not exist 
  if (localStorage.getItem("Cart") === null) {
    localStorage.setItem("Cart", JSON.stringify([document.getElementById("snackId").innerHTML]))
    localStorage.setItem("Quantity", JSON.stringify([document.getElementById("Quantity").value]))
    localStorage.setItem("Price", JSON.stringify([document.getElementById("Price").value]))
  }
  // add items into the cart and get list of snacks in local storage 
  else {
    currentCart = JSON.parse(localStorage.getItem("snackId"));
    currentQuantity = JSON.parse(localStorage.getItem("Quantity"));
    currentPrice = JSON.parse(localStorage.getItem("Price"));

    this_Item = document.getElementById("snackId").innerHTML; 
    this_Quantity = document.getElementById("Quantity").value;
    this_Price = document.getElementById("Price").value;

    // check if the item is already there 
    let found = false ; 
    for (let i = 0 ; i < currentCart.length ; i++) {
      let snack_id = currentCart[i] ; 
      if (snack_id.localeCompare(this_Item) == 0) {
        found = true ; 
        break ;
      }
    }

    if(found) {
      currentQuantity++ ; 
      currentPrice += this_Price ;
    }

    currentCart.push(this_Item) ;
    localStorage.setItem("Cart", JSON.stringify(currentCart));
    localStorage.setItem("Quantity", JSON.stringify(currentQuantity));
    localStorage.setItem("Price", JSON.stringify(currentPrice));
  }
}

// when customer click checkout, the order should be save in database and local storage should be cleared 
const checkOut = async(req, res) => {
  //save the orders to the database
  
  res.redirect("/vendors/")
}

// export the functions
module.exports = {
  getAllSnacks,
  getOneSnack,
  addNewItemInOrder,
  getCart,
  addToLocalStorage,
  checkOut
};
