const { default: mongoose } = require("mongoose");

const primaryMaterial = mongoose.Schema({
   primaryMaterial_name : {type: String},
   primaryMaterial_status : {type :Boolean}
})

module.exports = mongoose.model('primaryMaterial',primaryMaterial);