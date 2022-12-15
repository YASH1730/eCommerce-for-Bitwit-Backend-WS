const { default: mongoose } = require('mongoose')

const transfer = mongoose.Schema({
    product_articles : {type : Array, default : []}, 
    hardware_articles : {type : Array, default : []}, 
    quantity : {type : Number}, 
    order_no : {type : String}, 
    transfer_id : {type : String}, 
    purpose : {type : String}, 
    reason : {type : String}, 
    warehouse : {type : String}, 
    date : {type : Date, default : Date.now()}, 
})

module.exports = mongoose.model('transfer',transfer);