const { default: mongoose } = require("mongoose");

const coupon = mongoose.Schema(
  {
    customer_ids: { type: Array, default: [] },
    coupon_code: { require: true, type: String, unique: true },
    coupon_type: { type: String, default: "" },
    flat_amount: { type: Number, default: 0 },
    times: { type: Number, default: 0 },
    off: { type: Number, default: 0 },
    valid_from: { type: String, default: "" },
    expiry: { type: String, default: "" },
    coupon_description: { type: String, default: "" },
  },
  { timestamp: true }
);

module.exports = mongoose.model("coupon", coupon);
