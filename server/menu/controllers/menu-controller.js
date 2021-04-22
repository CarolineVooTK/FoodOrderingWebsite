const MenuModel = require("../models/MenuItem");

// import menu model
const menuitems = MenuModel.menuitems;
let ObjectId = require("mongoose").Types.ObjectId;

// get all snacks
const getAllSnacks = async (req, res) => {
  try {
    await menuitems
      .find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
    // return res.json(snacks);
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

// remember to export the functions
module.exports = {
  getAllSnacks,
  getOneSnack,
};
