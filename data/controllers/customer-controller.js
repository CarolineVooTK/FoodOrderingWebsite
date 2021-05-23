const CustomerModel = require("../models/customerModel");
const { menuItemsSchema } = require("../models/Vendor");
const { menuitems } = require("../models/MenuItem");
const { vendors } = require("../models/Vendor");
let ObjectId = require("mongoose").Types.ObjectId;
const customer = CustomerModel.customer;
const point = CustomerModel.point;
const bcrypt = require("bcrypt-nodejs");
// let ObjectId = require("mongoose").Types.ObjectId;

const getCustDetails = async (req, res) => {
  let customers = await customer.findById({ _id: req.session.passport.user });
  // console.log("vendor =",vendor)

  res.render("profile", {
    custFamName: customers.familyName,
    custGivenName: customers.givenName,
    custEmail: customers.email,
    custPassword: customers.password,
  });
};

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

const deleteOrderItem = async (req, res) => {
  let found = -1;
  for (index = 0; index < req.session.orderlist.length; index++) {
    if (req.session.orderlist[index].menuitem == new ObjectId(req.params.snackid)) {
      found = index;
    }
  }
  if (found > -1) {
    req.session.orderlist.splice(found, 1);
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
      res.render("vendor", { vendor: data[0], orderitems: req.session.orderlist });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

const addNewOrderItem = async (req, res) => {
  if (req.session.orderlist == null) {
    req.session.orderlist = [];
  }
  await menuitems.findOne({ _id: req.params.snackid }, function (err, menu) {
    var newMenuItem = {};
    newMenuItem.menuitem = new ObjectId(`${menu._id}`);
    newMenuItem.quantity = 1;
    newMenuItem.name = menu.name;
    newMenuItem.vendorid = new ObjectId(`${req.params.vendorid}`);
    newMenuItem.price = menu.price;
    let found = 0;
    for (index = 0; index < req.session.orderlist.length; index++) {
      if (
        req.session.orderlist[index].menuitem == newMenuItem.menuitem &&
        req.session.orderlist[index].vendorid == newMenuItem.vendorid
      ) {
        req.session.orderlist[index].quantity = req.session.orderlist[index].quantity + 1;
        found = 1;
      }
    }
    if (found == 0) {
      req.session.orderlist.push(newMenuItem);
    }
  });
  let totalprice = 0;
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
      for (index = 0; index < req.session.orderlist.length; index++) {
        if (req.params.vendorid == req.session.orderlist[index].vendorid) {
          totalprice += req.session.orderlist[index].quantity * req.session.orderlist[index].price;
        }
      }
      req.session.fromVendor = data[0];

      res.render("vendor", {
        vendor: req.session.fromVendor,
        orderitems: req.session.orderlist,
        totalPrice: totalprice,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
  // res.render("home")
};

module.exports = {
  getCustomerByEmail,
  addNewOrderItem,
  deleteOrderItem,
  getCustDetails,
};
