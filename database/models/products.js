const { default: mongoose } = require("mongoose");

const product = mongoose.Schema({
    SKU : {required : true, type : String, unique: true},
    product_title : {required : true, type : String, unique:true},
    category_name : {required : true, type : String},
    sub_category_name : {required : true, type : String},
    product_description : {required : true, type : String},
    seo_title : {required : true, type : String},
    seo_description : {required : true, type : String},
    blog_url : {required : true, type : String},
    product_image : {required : true, type : String},
    MRP : {required : true, type : String},
    selling_price : {required : true, type : String},
    discount_limit : {required : true, type : String},
    dispatch_time : {required : true, type : Date},
})

module.exports = mongoose.model('product',product);