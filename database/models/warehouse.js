const { default: mongoose } = require("mongoose");

const warehouse = mongoose.Schema({
    name : {type : String,default : ''},
    address : {type : String,default : ''},
});

module.exports = mongoose.model("warehouse", warehouse);
