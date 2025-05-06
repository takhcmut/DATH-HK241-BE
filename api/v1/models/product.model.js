const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    name: String,
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
    price: Number,
    original_price: Number,
    discount_rate: Number,
    rating_average: {
      type: Number,
      default: 0,
    },
    primary_category_path: {
      type: String,
      default: "1/2",
    },
    thumbnail_url: String,
    description: { type: String, default: "" },
    stock_item: {
      qty: { type: Number, default: 0 },
    },
    quantity_sold: {
      text: {
        type: String,
        default: "Đã bán 0",
      },
      value: {
        type: Number,
        default: 0,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    categories: {
      id: Number,
      name: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
