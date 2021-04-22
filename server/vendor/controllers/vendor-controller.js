const VendorModel = require("../models/Vendor");
const vendors = VendorModel.vendors;
const point = VendorModel.point;
let ObjectId = require("mongoose").Types.ObjectId;

// gets all vendors from the database
const getAll = async (req, res) => {
  await vendors
    .aggregate([
      { $unwind: "$menu" },
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
        $group: {
          _id: "$_id",
          root: { $mergeObjects: "$$ROOT" },
          menu: { $push: "$menu" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$root", "$$ROOT"],
          },
        },
      },
      {
        $project: {
          root: 0,
          password: 0,
          email: 0,
        },
      },
    ])
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Vendors not found",
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

// gets a single vendor from the database by matching its id
const getVendorById = async (req, res) => {
  await vendors
    .aggregate([
      { $match: { _id: new ObjectId(`${req.params.id}`) } },
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
      if (!data) {
        return res.status(404).json({
          message: "Vendor not found",
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

const addNewVendor = async (req, res) => {
  let vendor = new vendors({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await vendor
    .save()
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Vendor not created",
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

// sets a single vendor from the database to active, and
// updates its latitude, longitude and text location
const setVendorActive = async (req, res) => {
  const { longitude, latitude, textlocation } = req.body;
  await vendors
    .findOneAndUpdate(
      { _id: req.params.id },
      {
        active: true,
        location: new point({ type: "Point", coordinates: [longitude, latitude] }),
        textlocation: textlocation,
      },
      { returnNewDocument: true }
    )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Vendor not updated",
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

// gets all outstanding orders from the database
const getOutstandingOrders = async (req, res) => {
  await vendors
    .aggregate([
      { $match: { _id: new ObjectId(`${req.params.id}`) } },
      {
        $lookup: {
          from: "orders",
          localField: "orders",
          foreignField: "_id",
          as: "orders",
        },
      },
      { $match: { "orders.status": "pending" } },
      {
        $lookup: {
          from: "customers",
          localField: "orders.customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $project: {
          name: 1,
          "orders._id": 1,
          "orders.status": 1,
          "orders.time": 1,
          "orders.price": 1,
          "orders.orderitems": 1,
          "customer.name": 1,
          "customer.id": 1,
        },
      },
    ])
    .then((data) => {
      if (!data) {
        return res.status(200).json({
          message: "vendor has no outstanding orders",
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
  getVendorById,
  addNewVendor,
  setVendorActive,
  getOutstandingOrders,
};
