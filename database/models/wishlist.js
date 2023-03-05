const { default: mongoose } = require("mongoose");

const wishlist = mongoose.Schema({
  CID: { type: String },
  product_id: { type: String },
  quantity: { type: Number },
});

module.exports = mongoose.model("wishlist", wishlist);
