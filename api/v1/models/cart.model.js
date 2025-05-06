const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: Number,
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
