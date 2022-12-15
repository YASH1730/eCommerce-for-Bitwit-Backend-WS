const { default: mongoose } = require('mongoose')

const inward = mongoose.Schema({
    product_articles : {type : Array, default : []}, 
    hardware_articles : {type : Array, default : []}, 
    supplier : {type : String}, 
    vehicle_no : {type : String}, 
    driver_name : {type : String}, 
    quantity : {type : Number}, 
    order_no : {type : String}, 
    inward_id : {type : String}, 
    date : {type : Date, default : Date.now()}, 
})

module.exports = mongoose.model('inward',inward);