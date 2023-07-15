const { default: mongoose } = require("mongoose");

const purchase_order = mongoose.Schema({
    PID : {type : String, required : true, unique : true  },
    product_articles: { type: Array, default: [] },
    hardware_articles: { type: Array, default: [] },
    note: { type: String, default: "" },
    completed : {type : Boolean, default : false}
});

module.exports = mongoose.model("purchase_order", purchase_order);


