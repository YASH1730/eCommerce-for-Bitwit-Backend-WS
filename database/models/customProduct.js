const { default: mongoose } = require("mongoose");

const customProduct = mongoose.Schema({
   CUS : {type: String, unique : true, required : true},
   product_title : {type: String},
   product_images : {type: Array},
   length : {type : Number},
   height : {type : Number},
   breadth : {type : Number},
   selling_price : {type : Number} ,
   MRP : {type : Number} ,
   discount : {type : Number},
   polish_time  :  {type : String}
   
})

module.exports = mongoose.model('customProduct',customProduct);