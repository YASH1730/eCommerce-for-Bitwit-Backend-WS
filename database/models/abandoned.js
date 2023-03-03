const { default: mongoose } = require("mongoose");

const abandoned = mongoose.Schema({
  order_time: { type: Date, default: Date.now },
  uuid: { type: String },
  status: { type: String },
  CID: { type: String },
  customer_name: { type: String },
  customer_email: { type: String },
  customer_mobile: { type: String },
  city: { type: String },
  state: { type: String },
  shipping: { type: String },
  billing: { type: String },
  quantity: { type: Object },
  discount: { type: Number },
  paid: { type: Number },
  total: { type: Number },
  discount: { type: Number },
  note: { type: String },
  custom_order: { type: Boolean, default: false },
  sale_channel: { type: String, default: "Online" },
});

module.exports = mongoose.model("abandoned", abandoned);
