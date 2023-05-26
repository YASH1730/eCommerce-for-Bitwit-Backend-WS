const { default: mongoose } = require("mongoose");

const user = mongoose.Schema({
    user_id : {type : String, default : ""},
    user_name : {required : true, type : String},
    password : {required : true, type : String},
    email : {required : true, type : String,unique : true},
    mobile : {type : Number},
    role : {type :String},
    access : {type : Array, default : []},
    department : {type : String, default : ""},

})

module.exports = mongoose.model('userdata',user);