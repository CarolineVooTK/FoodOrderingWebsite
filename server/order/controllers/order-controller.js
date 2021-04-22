const OrderModel = require("../models/Order");
const orders = OrderModel.orders;
const orderItems = OrderModel.orderItems;
let ObjectId = require("mongoose").Types.ObjectId;

// gets all orders from the database
const getAll = async (req, res) => {
  await orders
    .aggregate([
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
      if (!data) {
        return res.status(404).json({
          message: "Orders not found",
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
      if (!data) {
        return res.status(404).json({
          message: "Order not found",
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
    .findOneAndUpdate({ _id: req.params.id }, { status: "Fulfilled" }, { returnNewDocument: true })
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
  getAll,
  getOrderById,
  createNewOrder,
  setOrdersFulfilled,
};
