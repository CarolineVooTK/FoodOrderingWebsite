const VendorModel = require("../models/Vendor");
const vendors = VendorModel.vendors;
const point = VendorModel.point;
let ObjectId = require("mongoose").Types.ObjectId;

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

const setVendorActive = async (req, res) => {
  const { longitude, latitude } = req.body;
  await vendors
    .findOneAndUpdate(
      { _id: req.params.id },
      { active: true, location: new point({ type: "Point", coordinates: [longitude, latitude] }) },
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
      // $lookup: {
      //     from: "orders",
      //     let:{orders = mongoose},
      //     pipeline: [
      //       { $match: {
      //           $expr: { $and: [
      //               { $eq: [ "pending", "$status" ] },
      //               { $eq: [ "$_id", "$$orders" ] }
      //           ] }
      //       } }
      //     ],
      //     as: "orders",
      //   },
    },
    {$match: {"orders.status":"pending"}},
    {
      $project: {
        name: 1,
        orders: 1
      },
    },
  ])
  .then((data) => {
    if(!data){
      return(res.status(200)).json({
        message: "vendor has no outstanding orders",
      })
    }res.status(200).json(data);
  })
  .catch((error) => {
    res.status(500).json({
      error: error,
    })
  })
}

module.exports = {
  getAll,
  getVendorById,
  addNewVendor,
  setVendorActive,
  getOutstandingOrders
};
