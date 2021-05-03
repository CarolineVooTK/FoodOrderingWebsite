const CustomerModel = require("../models/CustomerModel");
const customer = CustomerModel.customer;
const point = CustomerModel.point;
const bcrypt = require('bcryptjs');
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

const addNewCustomer = async (req,res) => {
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

}


const customerAuth = async (req, res) => {
  // var a  = "password"
  // hash = bcrypt.hashSync(a, 8);
  // console.log("result = ",bcrypt.compareSync(a,hash))
  // console.log("var hash = bcrypt.hashSync(\"password\", 8) = ", hash)
  // console.log("cusAuth in server: req.body = ",req.body)
    let cust = await customer.findOne({email: req.body.email}).lean()
      .then((data) => {
        if (!data) {
          return res.status(404).json({
            message: "Customer not found",
          });
        }
        else{
            // if (bcrypt.compareSync(data.password,req.body.password)){
            //     res.status(200).json(data);
            // }
            if (data.password = req.body.password){
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
      customerAuth,
      addNewCustomer
  };