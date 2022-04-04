const { default: mongoose } = require("mongoose");

const user = mongoose.Schema({
    user_Name : {required : true, type : String},
    password : {required : true, type : String},
    email : {required : true, type : String,unique : true},
    address : String,
    phoneNumber : Number

})

module.exports = mongoose.model('userdata',user);