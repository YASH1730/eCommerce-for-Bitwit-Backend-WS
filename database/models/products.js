const { default: mongoose } = require("mongoose");

const product = mongoose.Schema({
    SKU : {required : true, type : String, unique: true},
    Title : {required : true, type : String, unique:true},
    Product_Specificaton : {required : true, type : String},
    Product_Description : {required : true, type : String},
    SEO_Title : {required : true, type : String},
    SEO_Description : {required : true, type : String},
    Blogs_Link : {required : true, type : String},
    Product_Images : {required : true, type : String},
    MRP : {required : true, type : String},
    Selling_Price : {required : true, type : String},
    Dicount_Limit : {required : true, type : String},
    Dispatch_Time : {required : true, type : Date},
})

module.exports = mongoose.model('product',product);