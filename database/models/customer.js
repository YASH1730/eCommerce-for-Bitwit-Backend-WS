const { default: mongoose } = require("mongoose");

const customer = mongoose.Schema({
   CID : {type: String ,unique : true},
   register_time : {type : Date , default :  Date.now },
   profile_image : {type : String},
   name : {type : String},
   mobile : {type : Number, unique : true},
   email : {type : String, unique : true},
   password : {type : String},
   pincode : {type : Number},
   city : {type : String},
   state : {type : String},
   landmark : {type : String},
   shipping : {type : Array},
})

module.exports = mongoose.model('customer',customer);