const { default: mongoose } = require("mongoose");

const supplier = mongoose.Schema({
   SID :  {type :String, unique : true},
   supplier_name :  {type :String},
   mobile :  {type :Number},
   gst_no :  {type :String},
   alt_mobile :  {type :Number},
   specialization :  {type :String},
   address :  {type :String},
})

module.exports = mongoose.model('supplier',supplier);