const CustomerModel = require("../models/customerModel");
const { menuItemsSchema } = require("../../vendor/models/Vendor")
const { menuitems } = require("../../menu/models/MenuItem")
const { vendors } = require("../../vendor/models/Vendor")
let ObjectId = require("mongoose").Types.ObjectId;
const customer = CustomerModel.customer;
const point = CustomerModel.point;
const bcrypt = require("bcrypt-nodejs");
// let ObjectId = require("mongoose").Types.ObjectId;

const getCustomerByEmail = async (req, res) => {
  let cust = await customer
    .findOne({ email: req.params.email })
    .lean()
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};


const deleteOrderItem = async (req,res) => {
  let found = -1
  for(index = 0; index < req.session.orderlist.length; index++){
    if (req.session.orderlist[index].menuitem == req.params.snackid){
      found = index
    }
  }
  if (found > -1){
    req.session.orderlist.splice(index, 1);
  }
  await vendors
    .aggregate([
      { $match: { _id: new ObjectId(`${req.params.vendorid}`) } },
      {
          $lookup: {
            from: "menuitems",
            localField: "menu.menuitem",
            foreignField: "_id",
            as: "menu.menuitem",
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "orders",
            foreignField: "_id",
            as: "orders",
          },
        },
        {
          $project: {
            password: 0,
            email: 0,
          },
        },
      ])
      .then((data) => {
        res.render("vendor", { vendor: data[0], orderitems:req.session.orderlist});
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
}



const addNewOrderItem = async (req, res) => {
  console.log("req.params.snackid= ", req.params.snackid)
  console.log("req.params.vendorid= ", req.params.vendorid)
  console.log("addnew before: req.session = ",req.session)
  if (req.session.orderlist == null){
    req.session.orderlist = []
  }
  await menuitems.findOne({_id : req.params.snackid}, function(err,menu){
    var newMenuItem = { } 
    newMenuItem.menuitem = new ObjectId(`${menu._id}`)
    newMenuItem.quantity = 1
    newMenuItem.name = menu.name
    let found = 0
    for(index = 0; index < req.session.orderlist.length; index++){
      if (req.session.orderlist[index].menuitem == newMenuItem.menuitem){
        req.session.orderlist[index].quantity = req.session.orderlist[index].quantity+1
        found = 1
      }
    }
    if (found == 0){
      req.session.orderlist.push(newMenuItem)
    }
  })
  console.log("addnew: req.session.orderlist = ",req.session.orderlist)
  await vendors
    .aggregate([
      { $match: { _id: new ObjectId(`${req.params.vendorid}`) } },
      {
          $lookup: {
            from: "menuitems",
            localField: "menu.menuitem",
            foreignField: "_id",
            as: "menu.menuitem",
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "orders",
            foreignField: "_id",
            as: "orders",
          },
        },
        {
          $project: {
            password: 0,
            email: 0,
          },
        },
      ])
      .then((data) => {
        res.render("vendor", { vendor: data[0], orderitems:req.session.orderlist});
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  // res.render("home")
}


module.exports = {
  getCustomerByEmail,
  addNewOrderItem,
  deleteOrderItem,
};
