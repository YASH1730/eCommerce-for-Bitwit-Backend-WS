const { default: mongoose } = require("mongoose");

const hardware = mongoose.Schema({
    SKU : {required : true, type : String, unique: true},
    title : {required : true, type : String},
    category_name : { type : String},
    category_id : { type : String},
    sub_category_name : { type : String},
    sub_category_id : {type : String},
    hardware_image : {required : true, type : Array},
    warehouse : {type : String},
    bangalore_stock : { type : Number},
    jodhpur_stock : { type : Number},
    manufacturing_time: {required : true, type : String},
    status : {required : true, type : Boolean},
    returnDays : {type : Number},
    COD : {type : Boolean},
    returnable : {type : Boolean},
    quantity : {type : Number},
    package_length : {type : Number},
    package_height : {type : Number},
    package_breadth : {type : Number},
    unit : {type : String},
    selling_price : { type : Number},
    showroom_price : { type : Number},
    polish_time: { type : Number},
})

module.exports = mongoose.model('hardware',hardware);