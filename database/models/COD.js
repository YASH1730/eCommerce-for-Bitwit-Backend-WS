const mongoose = require('mongoose');

const COD  = mongoose.Schema({
    limit_without_advance : {type : Number, default  : 0} ,
    max_advance_limit : {type : Number, default  : 0} ,
    min_advance_limit : {type : Number, default  : 0} ,
    limit : {type : String} ,
    
}, {
    timestamps : true
})

module.exports = mongoose.model('COD',COD);
