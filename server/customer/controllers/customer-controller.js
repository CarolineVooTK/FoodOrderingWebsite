const CustomerModel = require("../models/CustomerModel");
const customer = CustomerModel.customer;
const point = CustomerModel.point;
let ObjectId = require("mongoose").Types.ObjectId;

const getCustomerByEmail = async (req, res) => {
    let cust = await customer.findOne({email:req.params.email}).lean()
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


const customerAuth = async (req, res) => {
    let cust = await customer.findOne({email: req.body.email}).lean()
      .then((data) => {
        if (!data) {
          return res.status(404).json({
            message: "Customer not found",
          });
        }
        else{
            if (data.password == req.body.password){
                res.status(200).json(data);
            }
            else{
                return res.status(404).json({
                    message: "Authentication Fail",
                });
            }
        };
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  };


  module.exports = {
      getCustomerByEmail,
      customerAuth
  };