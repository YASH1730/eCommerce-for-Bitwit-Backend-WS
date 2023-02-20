const { default: mongoose } = require("mongoose");

const cod = mongoose.Schema(
  {
    pincode: { type: Number, unique: true },
    delivery_status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("pincode", cod);
