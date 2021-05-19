const OrderModel = require("../models/Order");
const orders = OrderModel.orders;
const orderItems = OrderModel.orderItems;
let ObjectId = require("mongoose").Types.ObjectId;

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
          _id: 0,
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

const placeOrder = async (req, res) => {
  let totalprice = 0;
  for (index = 0; index < req.session.orderlist.length; index++) {
    totalprice += req.session.orderlist[index].quantity * req.session.orderlist[index].price;
  }
  var newOrder = new orders();
  newOrder.customerId = new ObjectId(`${String(req.session.passport.user)}`);
  newOrder.vendorId = new ObjectId(`${req.session.orderlist[0].vendorid}`);
  newOrder.orderitems = [];
  newOrder.price = totalprice;
  newOrder.status = "pending";

  for (index = 0; index < req.session.orderlist.length; index++) {
    var newOrderItem = new orderItems();
    newOrderItem.menuitem = new ObjectId(`${String(req.session.orderlist[index].menuitem)}`);
    newOrderItem.quantity = req.session.orderlist[index].quantity;
    newOrder.orderitems.push(newOrderItem);
  }
  newOrder.save(function (err) {
    if (err) throw err;
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
      console.log("req", req);
      // if (req.body && req.body.id) {
      //   return data[0];
      // } else {
      //   res.render("orders", { order: data[0] });
      // }
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

// creates a new order and saves it to the database when
// passed the required values in req.body
const createNewOrder = async (req, res) => {
  const { menuItemId, quantity, customerId, vendorId, price } = req.body;
  let order = new orders({
    orderitems: [new orderItems({ menuitem: new ObjectId(menuItemId), quantity: quantity })],
    quantity: quantity,
    customerId: new ObjectId(customerId),
    vendorId: new ObjectId(vendorId),
    time: Date.now(),
    price: price,
  });
  await order
    .save()
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Order not created",
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

// sets a single order's status to fulfilled by matching its id to the req.params id value
const setOrdersFulfilled = async (req, res) => {
  await orders
    .findOneAndUpdate({ _id: req.params.id }, { status: "Fulfilled" })
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
  createNewOrder,
  setOrdersFulfilled,
  getVendorRating,
  placeOrder 
};
