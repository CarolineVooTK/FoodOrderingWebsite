const CustomerModel = require("../models/customerModel");
const customer = CustomerModel.customer;
const point = CustomerModel.point;
const bcrypt = require("bcrypt");
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

const addNewCustomer = async (req, res) => {
  // let hash =bcrypt.hashSync(req.body.password, 8)
  // console.log("hash = ",hash)
  let cust = new customer({
    givenName: req.body.givenName,
    familyName: req.body.familyName,
    email: req.body.email,
    password: req.body.password,
  });
  await cust
    .save()
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Customer not created",
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

const customerAuth = async (req, res) => {
  let cust = await customer
    .findOne({ email: req.email })
    .lean()
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Customer not found",
        });
      } else {
        if (bcrypt.compare(data.password, req.body.password)) {
          res.status(200).json(data);
        } else {
          return res.status(404).json({
            message: "Authentication Fail",
          });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

module.exports = {
  getCustomerByEmail,
  customerAuth,
  addNewCustomer,
};
