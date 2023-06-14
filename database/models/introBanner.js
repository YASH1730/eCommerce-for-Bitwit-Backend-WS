const { default: mongoose } = require("mongoose");

const introBanner = mongoose.Schema({
  title: { type: String },
  display_content: { type: String },
  banner: { type: String },
  status : {type : Boolean,default : false}
});

module.exports = mongoose.model("introBanner", introBanner);
