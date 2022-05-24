const mongoose = require('mongoose');

const user  = mongoose.Schema({
    uuid : {type : String, unique : true},
    review : [{email : String,comment : String}]
})

module.exports = mongoose.model('reviewData',user);
