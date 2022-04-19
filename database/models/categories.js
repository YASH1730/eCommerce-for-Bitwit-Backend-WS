const { default: mongoose } = require("mongoose");

const categories = mongoose.Schema({
    category_name : {required : true, type : String, unique: true},
    sub_category_name : {required : true, type : String},
    category_image : {required : true, type : String}
})

module.exports = mongoose.model('categories',categories);