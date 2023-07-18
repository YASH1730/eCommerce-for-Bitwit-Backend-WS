const { default: mongoose } = require("mongoose");

const stock = mongoose.Schema({
   product_id: { type: String, default : "" },
   stock: { type: Number,default : 0 },
   warehouse: { type: String , default : "" },
   PID: { type: String, default : "" },
}, { timestamps: true });

module.exports = mongoose.model('stock', stock);