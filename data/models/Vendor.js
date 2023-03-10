const mongoose = require("mongoose");
const MenuItemSchema = require("./MenuItem");
const { menuitems } = require("./MenuItem");
const bcrypt = require("bcrypt-nodejs");
let ObjectId = require("mongoose").Types.ObjectId;

// Point Schema is used for the geolocation of Vendor 
const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

// menu Schema (a menu contains numbers of snacks with related menuitem id and quantity available)
const menuItemsSchema = new mongoose.Schema(
  {
    menuitem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// Vendor schema
const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: pointSchema, required: false },
    textlocation: { type: String, required: false },
    active: { type: Boolean, required: false },
    description: { type: String, required: false },
    rating: { type: Number, required: false },
    count: { type: Number, required: false },
    orders: { type: [mongoose.Schema.Types.ObjectId], required: false },
    menu: { type: [menuItemsSchema], required: false },
  },
  { versionKey: false }
);

// the method to generate hash password for new vendor
VendorSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// the method to validate the password when vendor sign in
VendorSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// VendorSchema.methods.generateMenu = async function(){
//   vendormenu = []
//   await menuitems.find({}, function(err,menus){
//     // let temp_json
//     // menus.forEach(function(menu){
//     //   temp_json = {"menuitem":{"$oid": new ObjectId((`${menu._id}`))},"quantity": 0}
//     //   vendormenu.push(temp_json)
//     // });
//     // console.log("vendormenu = ",vendormenu)
//     vendormenu = menus
//   })
//   return vendormenu
// }

// model from schema
module.exports = {
  vendors: mongoose.model("vendors", VendorSchema),
  menuItemsSchema: mongoose.model("menuItemsSchema", menuItemsSchema),
  point: mongoose.model("point", pointSchema),
};
