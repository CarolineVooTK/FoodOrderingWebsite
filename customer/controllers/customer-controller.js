const CustomerModel = require("../models/customerModel");
const customer = CustomerModel.customer;
const point = CustomerModel.point;
const bcrypt = require("bcrypt-nodejs");
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


module.exports = {
  getCustomerByEmail,
};
