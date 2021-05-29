const VendorModel = require("../models/Vendor");
const OrderModel = require("../models/Order");
const vendors = VendorModel.vendors;
const point = VendorModel.point;
const orders = OrderModel.orders;
let ObjectId = require("mongoose").Types.ObjectId;
const { json } = require("express");

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
      res.render("vendors", { vendors: data });
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
      res.render("vendor", { vendor: data[0], orderitems: req.session.orderlist });
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
      // console.log(error)
      res.status(500).json({
        error: error,
      });
    });
};

// sets a single vendor from the database to active, and
// updates its latitude, longitude and text location
const setVendorActive = async (req, res) => {
  let { longitude, latitude, textlocation } = req.body;
  if (req.headers && req.headers.longitude) {
    longitude = req.headers.longitude;
    latitude = req.headers.latitude;
    textlocation = req.headers.textlocation;
  }
  let vendorId = req.session.passport.user;
  if (!latitude || !longitude || !textlocation || !vendorId) {
    return res.status(400).render("vendorProfile", {
      vendor_error: "Error wrong data",
      vendor_status: "Off",
    });
  }
  let rating_ = 0;
  let count_ = 0;
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
        rating_ = 0;
        count_ = 0;
      } else {
        rating_ = data[0].rating;
        count_ = data[0].count;
      }
    })
    .catch((error) => {});
  await vendors
    .findOneAndUpdate(
      { _id: vendorId },
      {
        active: true,
        location: new point({ type: "Point", coordinates: [latitude, longitude] }),
        textlocation: textlocation,
      },
      { returnNewDocument: true }
    )
    .then((data) => {
      if (!data) {
        return res.render("vendorProfile", {
          vendor_error: "Error wrong data",
          vendor_status: "Off",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
  let vendor_ = await vendors.findById({ _id: vendorId }).lean();
  res.status(200).render("vendorProfile", {
    vendor_status: "Active",
    vendor: vendor_,
    rating: rating_,
    count: count_,
  });
};

const getStatus = async (req, res) => {
  let rating_ = 0;
  let count_ = 0;
  await orders
    .aggregate([
      {
        $match: {
          $and: [
            { vendorId: new ObjectId(`${req.session.passport.user}`) },
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
        rating_ = 0;
        count_ = 0;
      } else {
        rating_ = data[0].rating;
        count_ = data[0].count;
      }
    })
    .catch((error) => {});

  let vendor_ = await vendors.findById({ _id: req.session.passport.user }).lean();
  if (vendor_.active) {
    vendor_current_status = "Active";
  } else {
    vendor_current_status = "Off";
  }
  res.render("vendorProfile", {
    vendor_status: vendor_current_status,
    vendor: vendor_,
    rating: rating_,
    count: count_,
  });
};

const setVendorOff = async (req, res) => {
  let rating_ = 0;
  let count_ = 0;
  await orders
    .aggregate([
      {
        $match: {
          $and: [
            { vendorId: new ObjectId(`${req.session.passport.user}`) },
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
        rating_ = 0;
        count_ = 0;
      } else {
        rating_ = data[0].rating;
        count_ = data[0].count;
      }
    })
    .catch((error) => {});
  await vendors
    .findOneAndUpdate(
      { _id: req.session.passport.user },
      {
        active: false,
      },
      { returnNewDocument: true }
    )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Vendor not updated",
        });
      }
      // res.render("vendorProfile", { vendor_status: "Off", vendor: vendor_, rating: rating_, count: count_});
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
  let vendor_ = await vendors.findById({ _id: req.session.passport.user }).lean();
  res.status(200).render("vendorProfile", {
    vendor_status: "Off",
    vendor: vendor_,
    rating: rating_,
    count: count_,
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
          "customer.givenName": 1,
          "customer._id": 1,
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

// get outstanding orders of a specific vendor
const getOutsOrdersByVendor = async (req, res) => {
  await orders
    .aggregate([
      {
        $match: {
          $and: [
            { vendorId: new ObjectId(req.params.vendorid) },
            { $or: [{ status: "pending" }, { status: "Fulfilled" }] },
          ],
        },
      },
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
          from: "menuitems",
          localField: "orderitems.menuitem",
          foreignField: "_id",
          as: "orderitems2",
        },
      },
      {
        $addFields: {
          orderDetails: {
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
          customerRating: 0,
          orderitems: 0,
          orderitems2: 0,
          customerId: 0,
          vendorId: 0,
        },
      },
    ])
    .then((data) => {
      if (!data) {
        return res.status(200).json({
          message: "vendor has no outstanding orders",
        });
      }
      res.render("vendorOutstandingOrders", {
        OutstandingOrders: data,
        timer: encodeURIComponent(JSON.stringify(data)),
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
      res.send("Redirected to HomePage.");
      res.status(500).json({
        error: error,
      });
    });
};

// get all the past (picked up) orders from a vendor
const getPastOrdersByVendor = async (req, res) => {
  await orders
    .aggregate([
      {
        $match: {
          $and: [{ vendorId: new ObjectId(req.params.vendorid) }, { status: "Collected" }],
        },
      },
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
          from: "menuitems",
          localField: "orderitems.menuitem",
          foreignField: "_id",
          as: "orderitems2",
        },
      },
      {
        $addFields: {
          orderDetails: {
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
          customerRating: 0,
          orderitems: 0,
          orderitems2: 0,
          customerId: 0,
          vendorId: 0,
          _id: 0,
        },
      },
    ])
    .then((data) => {
      if (!data) {
        return res.status(200).json({
          message: "vendor has no picked up orders",
        });
      }
      res.render("vendorPastOrders", { PastOrders: data });
    })
    .catch((error) => {
      res.redirect("/");
      res.send("Redirected to HomePage.");
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
  getStatus,
  setVendorOff,
  getOutsOrdersByVendor,
  getPastOrdersByVendor,
};
