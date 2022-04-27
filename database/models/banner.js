const { default: mongoose } = require("mongoose");

const banner = mongoose.Schema({
   banner_URL : {type: String},
   banner_title : {type: String},
   banner_Status : {type :Boolean}
})

module.exports = mongoose.model('banner',banner);