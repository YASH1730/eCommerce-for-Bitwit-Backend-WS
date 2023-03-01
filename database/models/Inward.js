const { default: mongoose } = require("mongoose");

const inward = mongoose.Schema({
  warehouse: { type: String },
  product_articles: { type: Array, default: [] },
  hardware_articles: { type: Array, default: [] },
  supplier: { type: String },
  vehicle_no: { type: String },
  driver_name: { type: String },
  challan_no: { type: Number },
  driver_no: { type: Number },
  purpose: { type: String },
  quantity: { type: Number },
  order_no: { type: String },
  inward_id: { type: String },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("inward", inward);
