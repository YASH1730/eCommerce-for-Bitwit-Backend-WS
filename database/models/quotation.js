const mongoose = require("mongoose");

const quotation = mongoose.Schema({
    cus_polish : {type : Boolean, default : false},
    cus_polish_note : {type : String, default : ""},
    polish : {type : String, default : ""},
    cus_upholstery : {type : Boolean, default : false},
    cus_upholstery_note : {type : String, default : ""},
    upholstery : {type : String, default : ""},
    cus_design : {type : Boolean, default : false},
    cus_design_note : {type : String, default : ""},
    form : {type : String, default : "existing"},
    SKU : {type : String, default : ""},
    title : {type : String, default : ""},
    length : {type : Number, default :0},
    breadth : {type : Number, default :0},
    height : {type : Number, default :0},
    material : {type : Array, default : []},
    customUpholsteryImage : {type : Array, default : []},
    customDesignImage : {type : Array, default : []},
    customPolishImage : {type : Array, default : []},
}, { timestamps: true });

module.exports = mongoose.model("quotation", quotation);