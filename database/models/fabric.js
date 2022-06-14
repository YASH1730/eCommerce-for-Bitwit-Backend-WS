const { default: mongoose } = require("mongoose");

const fabric = mongoose.Schema({
    fabric_name : {required : true, type : String, unique: true},
    fabric_status : {required : true,type : Boolean},
    fabric_image : {required : true, type : String},
})

module.exports = mongoose.model('fabric',fabric);