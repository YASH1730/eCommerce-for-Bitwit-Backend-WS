const { default: mongoose } = require("mongoose");

const cod = mongoose.Schema({
    pincode: { type: Number, unique: true },
    city: {  type: String , default : '' },
    state: {  type: String , default : '' },
    delivery_status: {  type: Boolean , default : true },
},{timestamps : true})

module.exports = mongoose.model('pincode', cod);