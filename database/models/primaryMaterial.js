const { default: mongoose } = require("mongoose");

const primaryMaterial = mongoose.Schema({
   primaryMaterial_name : {type: String,unique : true},
   primaryMaterial_description : {type : String},
   primaryMaterial_image : {type : String},
   primaryMaterial_status : {type :Boolean}
})

module.exports = mongoose.model('primaryMaterial',primaryMaterial);