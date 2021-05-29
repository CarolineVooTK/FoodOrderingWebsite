const OrderModel = require("../models/Order");
const orders = OrderModel.orders;
const orderItems = OrderModel.orderItems;
let ObjectId = require("mongoose").Types.ObjectId;

const cancelSessionOrder = async (req, res) => {
  req.session.orderlist = null;
  res.redirect(`/vendors`);
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
    .then((data) => {})
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
    .findOneAndUpdate({ _id: new ObjectId(`${req.params.id}`) }, { status: "Fulfilled" },{returnOriginal:false})
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
    .findOneAndUpdate({ _id: new ObjectId(`${req.params.id}` )}, { status: "Collected" },{upsert: true},{returnOriginal:false})
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
//sets a single order status to cancelled
const setOrderCancelled = async (req, res) => {
  await orders
  .findOneAndUpdate({ _id: new ObjectId(`${req.params.id}` )}, { status: "Cancelled" },{upsert: true},{returnOriginal:false})
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
};
