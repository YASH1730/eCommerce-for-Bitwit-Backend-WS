const { default: mongoose } = require("mongoose");

const outward = mongoose.Schema({
  product_articles: { type: Array, default: [] },
  hardware_articles: { type: Array, default: [] },
  warehouse: { type: String },
  supplier: { type: String },
  vehicle_no: { type: String },
  driver_name: { type: String },
  driver_no: { type: Number },
  challan_no: { type: Number },
  quantity: { type: Number },
  order_no: { type: String },
  outward_id: { type: String },
  purpose: { type: String },
  reason: { type: String },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("outward", outward);
