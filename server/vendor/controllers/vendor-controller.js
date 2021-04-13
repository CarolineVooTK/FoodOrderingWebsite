const VendorModel = require("../models/Vendor");
const vendors = VendorModel.vendors;
const point = VendorModel.point;

const getAll = async (req, res) => {
  await vendors
    .find({})
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getVendorByName = async (req, res) => {
  await vendors
    .findOne({ name: req.params.name })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const addNewVendor = async (req, res) => {
  let vendor = new vendors({ name: req.body.name });
  await vendor
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const setVendorActive = async (req, res) => {
  const { longitude, latitude } = req.body;
  await vendors
    .findOneAndUpdate(
      { email: req.params.id },
      { active: true, location: new point({ type: "Point", coordinates: [longitude, latitude] }) }
    )
    .then(() => {
      res.send("updated vendor status and coordinates");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getAll,
  getVendorByName,
  addNewVendor,
  setVendorActive,
};
