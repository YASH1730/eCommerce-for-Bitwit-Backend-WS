const { default: mongoose } = require("mongoose");

const order = mongoose.Schema({
   OID : {type : String},
   order_time : {type : Date , default : Date.now},
   status : {type : String},
   CID : {type : String},
   customer_name : {type : String},
   customer_email : {type : String},
   customer_mobile : {type : String},
   city : {type : String},
   state : {type : String},
   shipping : {type : String},
   quantity : {type : Object},
   discount : {type : Number},
   paid : {type : Number}, 
   total : {type : Number}, 
   discount : {type : Number}, 
   
})

module.exports = mongoose.model('order',order);