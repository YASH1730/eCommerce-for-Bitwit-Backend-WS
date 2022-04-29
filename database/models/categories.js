const { default: mongoose } = require("mongoose");

const categories = mongoose.Schema({
    category_name : {required : true, type : String, unique: true},
    category_status : {required : true,type : Boolean},
    category_image : {required : true, type : String},
})

module.exports = mongoose.model('categories',categories);