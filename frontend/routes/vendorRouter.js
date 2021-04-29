const express = require("express");
const vendorRouter = express.Router();

const myapi = require("./api");

vendorRouter.get("/", async (req, res) => {
  await myapi
    .getSingleVendor()
    .then((data) => {
      res.render("vendors", { vendor: data[0] });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = vendorRouter;
