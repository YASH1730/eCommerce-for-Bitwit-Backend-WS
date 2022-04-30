const { default: mongoose } = require("mongoose");

const secondaryMaterial = mongoose.Schema({
   secondaryMaterial_name : {type: String},
   secondaryMaterial_status : {type :Boolean}
})

module.exports = mongoose.model('  secondaryMaterial',secondaryMaterial);