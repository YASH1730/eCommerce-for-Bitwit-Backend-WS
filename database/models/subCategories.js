const { default: mongoose } = require("mongoose");

const subCategories = mongoose.Schema({
    category_id : {required : true,type : String},
    category_name : {required : true,type : String},
    sub_category_name : {required : true, type : String, unique : true},
    sub_category_status : {required : true,type : Boolean},
})

module.exports = mongoose.model('subCategories',subCategories);