const { default: mongoose } = require("mongoose");

const order = mongoose.Schema({
   OID : {type : String},
   products : {type : Array},
   order_time : {type : Date , default : Date.now},
   status : {type : String},
   paid_amount : {type : Number}, 
   total_amount : {type : Number},
   CID : {type : String},
   customer_name : {type : String},
   customer_email : {type : String},
   shipping : {type : String},
   
})

module.exports = mongoose.model('order',order);