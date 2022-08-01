const { default: mongoose } = require("mongoose");

const textile = mongoose.Schema({
    textile_name : {required : true, type : String, unique: true},
    textile_status : {required : true,type : Boolean},
    textile_image : {required : true, type : String},
})

module.exports = mongoose.model('textile',textile);