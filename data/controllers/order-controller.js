const OrderModel = require("../models/Order");
const orders = OrderModel.orders;
const orderItems = OrderModel.orderItems;
let ObjectId = require("mongoose").Types.ObjectId;
let vendorController = require("./vendor-controller");

const cancelSessionOrder = async (req, res) => {
  req.session.orderlist = null;
  res.redirect(`/vendors`);
};

const changeOrder = async (req, res) => {
  let orderdetails = [];
  await orders
    .aggregate([
      { $match: { _id: new ObjectId(`${req.params.id}`) } },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $lookup: {
          from: "menuitems",
          localField: "orderitems.menuitem",
          foreignField: "_id",
          as: "orderitems",
        },
      },
      {
        $project: {
          "customer._id": 0,
          "customer.password": 0,
          "customer.familyName": 0,
          "vendor.password": 0,
          "customer.location": 0,
          "vendor.orders": 0,
          "vendor.menu": 0,
          customerId: 0,
          vendorId: 0,
        },
      },
    ])
    .then((data) => {
      orderdetails = data;
      // res.json(data);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });

  req.session.orderlist = [];
  let data = orderdetails[0];
  let vendorId = data.vendor[0]._id;
  for (let i = 0; i < data.orderitems.length; i++) {
    let menu = data.orderitems[i];
    var newMenuItem = {};
    newMenuItem.menuitem = new ObjectId(`${menu._id}`);
    newMenuItem.quantity = 1;
    newMenuItem.name = menu.name;
    newMenuItem.vendorid = new ObjectId(`${vendorId}`);
    newMenuItem.price = menu.price;
    let found = 0;
    for (index = 0; index < req.session.orderlist.length; index++) {
      if (
        req.session.orderlist[index].menuitem == newMenuItem.menuitem &&
        req.session.orderlist[index].vendorid == newMenuItem.vendorid
      ) {
        req.session.orderlist[index].quantity += 1;
        found = 1;
      }
    }
    if (found == 0) {
      req.session.orderlist.push(newMenuItem);
    }
  }
  let totalprice = 0;
  for (let z = 0; z < req.session.orderlist.length; z++) {
    totalprice += req.session.orderlist[z].quantity * req.session.orderlist[z].price;
  }
  req.session.fromVendor = data.vendor[0];
  req.session.orderChanged = true;
  res.redirect(`/vendors/${vendorId}`);
};

// gets all orders from a single customer
const getAllCustomerOrders = async (req, res) => {
  await orders
    .aggregate([
      { $match: { customerId: new ObjectId(`${req.params.id}`) } },
      {
        $lookup: {
          from: "menuitems",
          localField: "orderitems.menuitem",
          foreignField: "_id",
          as: "orderitems2",
        },
      },
      {
        $addFields: {
          order: {
            $map: {
              input: "$orderitems",
              in: {
                $mergeObjects: [
                  "$$this",
                  {
                    $arrayElemAt: [
                      "$orderitems2",
                      {
                        $indexOfArray: ["$orderitems2._id", "$$this.menuitem"],
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          orderitems: 0,
          orderitems2: 0,
          customerId: 0,
          vendorId: 0,
        },
      },
    ])
    .then((data) => {
      res.render("orders", { orders: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

// creates a new order and saves it to the database when
// passed the required values in req.body
const placeOrder = async (req, res) => {
  if (req.session.orderChanged) {
    // update the order in the database
  }
  req.session.orderChanged = false;
  let totalprice = 0;
  for (index = 0; index < req.session.orderlist.length; index++) {
    if (req.params.vendorid == req.session.orderlist[index].vendorid) {
      totalprice += req.session.orderlist[index].quantity * req.session.orderlist[index].price;
    }
  }
  var newOrder = new orders();
  newOrder.customerId = new ObjectId(`${String(req.session.passport.user)}`);
  newOrder.vendorId = new ObjectId(`${req.params.vendorid}`);
  newOrder.orderitems = [];
  newOrder.price = totalprice;
  newOrder.status = "pending";

  for (index = 0; index < req.session.orderlist.length; index++) {
    if (req.params.vendorid == req.session.orderlist[index].vendorid) {
      var newOrderItem = new orderItems();
      newOrderItem.menuitem = new ObjectId(`${String(req.session.orderlist[index].menuitem)}`);
      newOrderItem.quantity = req.session.orderlist[index].quantity;
      newOrder.orderitems.push(newOrderItem);
    }
  }
  newOrder.save(function (err) {
    if (err) {
      throw err;
    } else {
    }
  });
  res.redirect(`/customer/profile`);
};

// gets a single order from the database by matching its id
const getOrderById = async (req, res) => {
  await orders
    .aggregate([
      { $match: { _id: new ObjectId(`${req.params.id}`) } },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $lookup: {
          from: "menuitems",
          localField: "orderitems.menuitem",
          foreignField: "_id",
          as: "orderitems",
        },
      },
      {
        $project: {
          "customer._id": 0,
          "customer.password": 0,
          "customer.familyName": 0,
          "vendor.password": 0,
          "customer.location": 0,
          "vendor.orders": 0,
          "vendor.menu": 0,
          "vendor._id": 0,
          customerId: 0,
          vendorId: 0,
        },
      },
    ])
    .then((data) => {
      return data;
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

// gets the rating for a vendor by checking the rating of all the vendors orders
const getVendorRating = async (req, res) => {
  await orders
    .aggregate([
      {
        $match: {
          $and: [
            { vendorId: new ObjectId(`${req.params.vendorId}`) },
            { customerRating: { $gt: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          rating: { $avg: "$customerRating" },
          count: { $sum: 1 },
        },
      },
    ])
    .then((data) => {
      if (data.length === 0) {
        return [{ rating: 0, count: 0 }];
      }
      return data;
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

// sets a single order's status to fulfilled by matching its id to the req.params id value
const setOrderFulfilled = async (req, res) => {
  await orders
    .findOneAndUpdate(
      { _id: new ObjectId(`${req.params.id}`) },
      { status: "Fulfilled" },
      { returnOriginal: false }
    )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Orders cannot be Fulfilled.",
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

// sets a single order's status to collected by matching its id to the req.params id value
const setOrderCollected = async (req, res) => {
  await orders
    .findOneAndUpdate(
      { _id: new ObjectId(`${req.params.id}`) },
      { status: "Collected" },
      { upsert: true, returnOriginal: false }
    )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Error occurs when Collected button is pressed.",
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

//sets a single order status to cancelled
const setOrderCancelled = async (req, res) => {
  await orders
    .findOneAndUpdate(
      { _id: new ObjectId(`${req.params.id}`) },
      { status: "Cancelled" },
      { upsert: true, returnOriginal: false }
    )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Error Occurs when trying to cancel an order.",
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

// sets a single order's rating by matching its id to the req.params id value
const setOrderRating = async (req, res) => {
  let rated = 0;
  let r = Number(req.body.rating);
  if (r && !isNaN(r)) {
    rated = r;
  }
  await orders
    .findOneAndUpdate({ _id: req.params.id }, { customerRating: rated })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Error Occurs when trying to rate the order.",
        });
      }
      updateVendorRating(data.vendorId);
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

const updateVendorRating = async (vendorId) => {
  rating = 0;
  count = 0;
  await orders
    .aggregate([
      {
        $match: {
          $and: [{ vendorId: new ObjectId(`${vendorId}`) }, { customerRating: { $gt: 0 } }],
        },
      },
      {
        $group: {
          _id: null,
          rating: { $avg: "$customerRating" },
          count: { $sum: 1 },
        },
      },
    ])
    .then((data) => {
      if (data.length === 0) {
        rating = 0;
        count = 0;
      } else {
        rating = data[0].rating;
        count = data[0].count;
      }
      if (rating > 0 && count > 0) {
        vendorController.updateVendorRating(vendorId, rating, count);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getAllCustomerOrders,
  getOrderById,
  setOrderFulfilled,
  setOrderCollected,
  setOrderCancelled,
  setOrderRating,
  getVendorRating,
  cancelSessionOrder,
  placeOrder,
  changeOrder,
};
