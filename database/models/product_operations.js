const { default: mongoose } = require("mongoose");

const operations = mongoose.Schema({
    O : {type : String,default : ''},
    SKU : {type : String,default : ''},
    quantity : {type : Number,default : ''},
    depart_date : {type : Date,default : Date.now()},
    supplier_type : {type : String,default : ''},
    supplier : {type : String,default : ''},
    staff : {type : String,default : ''},
    status : {type : String,default : ''},
    location : {type : String,default : ''},
});

module.exports = mongoose.model("operations", operations);
