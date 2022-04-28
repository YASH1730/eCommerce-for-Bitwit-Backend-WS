const { default: mongoose } = require("mongoose");

const order = mongoose.Schema({
   order_id : {type : String},
   order_time : {type : Date , default : Date.now},
   customer_email : {type : String},
   order_address : {type : String},
   payment_method : {type : String},
   order_amount : {type : Number},
   order_status : {type : String},
})

module.exports = mongoose.model('order',order);