const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    orderId: {
      type: String,
    },
    status: Array,
    products: Array,
    sellerId: String,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
