const { default: mongoose } = require("mongoose");

const customer = mongoose.Schema({
  CID: { type: String, unique: true },
  register_time: { type: Date, default: Date.now },
  profile_image: { type: String },
  username: { type: String },
  mobile: { type: Number, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  classification: { type: String, default : 'personal' },
  customer_type: { type: String, default : '' },
  address: { type: Array, default : [] },
  billing: { type: Array, default : [] },
});

module.exports = mongoose.model("customer", customer);
