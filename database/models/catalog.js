const { default: mongoose } = require("mongoose");

const catalog = mongoose.Schema({
  catalog_type: { type: String },
  title: { type: String },
  SKU: { type: String },
});

module.exports = mongoose.model("catalog", catalog);
