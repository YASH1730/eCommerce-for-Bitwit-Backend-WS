const { default: mongoose } = require("mongoose");

const image = mongoose.Schema({
   image_url : {type: String},
   timestamp: { type: Date, default: Date.now},
})

module.exports = mongoose.model('image',image);