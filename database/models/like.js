const mongoose = require('mongoose');

const user  = mongoose.Schema({
    uuid : {type : String, unique : true},
    likes :{
             email : String,
             like : String}
    })

module.exports = mongoose.model('likeData',user);
