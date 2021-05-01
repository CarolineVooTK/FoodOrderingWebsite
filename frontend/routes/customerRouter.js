const express = require("express");
const customerRouter = express.Router();

const myapi = require("./api");

customerRouter.post("/login", async (req, res) => {
    // console.log("here")
    // console.log("cusRouter, req.body = ", req.body)
    await myapi
      .customerAuth(req,res)
      .then((data) => {
        // console.log("herre")
        // console.log(data)
        if (data){
            res.render("home");
        }
        else{
            res.render("login",{fail:1})
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });


module.exports = customerRouter;