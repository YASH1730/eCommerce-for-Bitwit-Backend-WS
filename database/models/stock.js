const { default: mongoose } = require("mongoose");

const stock = mongoose.Schema({
   product_id: { type: String },
   stock: { type: Number },
   warehouse: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('stock', stock);