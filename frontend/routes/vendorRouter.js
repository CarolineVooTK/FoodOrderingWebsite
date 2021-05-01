const express = require("express");
const vendorRouter = express.Router();

const myapi = require("./api");

vendorRouter.get("/", async (req, res) => {
  await myapi
    .getAllVendors()
    .then((data) => {
      res.render("vendors", { vendors: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

vendorRouter.get("/:vendorId", async (req, res) => {
  await myapi
    .getSingleVendor({ id: req.params.vendorId })
    .then((data) => {
      res.render("vendor", { vendor: data[0] });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = vendorRouter;
