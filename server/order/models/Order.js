const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    menuitem: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

// Order schema
const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderitems: { type: [OrderItemSchema], required: true },
    price: { type: Number, required: true },
    status: { type: String, required: false, default: "pending" },
    time: { type: Date, required: true, default: Date.now },
    customerRating: { type: Number, required: false, default: 0 },
    discountApplied: { type: Boolean, required: false },
    cancelDescription: { type: String, required: false },
  },
  { versionKey: false }
);

module.exports = {
  orders: mongoose.model("orders", OrderSchema),
  orderItems: mongoose.model("orderItem", OrderItemSchema),
};
