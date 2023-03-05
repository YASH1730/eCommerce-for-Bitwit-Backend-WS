const { default: mongoose } = require("mongoose");

const banner = mongoose.Schema({
  uuid: { type: String },
  web_banner: { type: String },
  web_url: { type: String },
  mobile_banner: { type: String },
  mobile_url: { type: String },
  banner_title: { type: String },
  web_banner_status: { type: Boolean, default: false },
  mobile_banner_status: { type: Boolean, default: false },
  sequence_no: { type: Number, default: null },
});

module.exports = mongoose.model("banner", banner);
