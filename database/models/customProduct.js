const { default: mongoose } = require("mongoose");

const customProduct = mongoose.Schema({
   CUS: { type: String, unique: true, required: true },
   product_title: { type: String },
   product_image: { type: Array, default  : [] },
   polish_image: { type: Array, default  : [] },
   length: { type: Number, default  : 0 },
   height: { type: Number, default  : 0 },
   breadth: { type: Number, default  : 0 },
   selling_price: { type: Number, default  : 0 },
   MRP: { type: Number, default  : 0 },
   discount: { type: Number, default  : 0 },
   polish_time: { type: Number, default : 0 },
   note: { type: String, default : '' },
   polish : {type : String, default : ''},
   cusPolish : {type : String, default : ''},
   polish_note : {type : String, default : ''},

})

module.exports = mongoose.model('customProduct', customProduct);