const mongoose = require("mongoose");

const nationSchema = new mongoose.Schema({
  num_code: String,
  alpha_2_code: String,
  alpha_3_code: String,
  en_short_name: String,
  nationality: String,
});

const Nation = mongoose.model("Nation", nationSchema, "nations");

module.exports = Nation;
