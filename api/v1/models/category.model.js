const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  id: Number,
  parent_id: Number,
  seller_id: String,
  text: String,
  name: String,
  icon_url: String,
  thumbnail_url: String,
  children: Array,
  is_leaf: Boolean,
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Category = new mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
