const { default: mongoose } = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const mergeproducts = mongoose.Schema({
    MS : {required : true, type : String, unique: true},
    SKU : {required : true, type : String, unique: true},
    product_array : {required : true, type : String},
    product_quantity : {required : true, type : String}, 
    product_title : {required : true, type : String},
    category_name : { type : String},
    bangalore_stock : { type : Number},
    category_id : { type : String},
    product_description : {type : String},
    product_image : {required : true, type : Array},
    featured_image : {required : true, type : String},
    mannequin_image : {required : true, type : String},
    specification_image : {required : true, type : String},
    selling_points : { type : String},
    selling_price : {required : true, type : Number},
    showroom_price : {required : true, type : Number},
    discount_limit : {required : true, type : Number},
    status : {required : true, type : Boolean},
})

module.exports = mongoose.model('mergeproducts',mergeproducts);