const mongoose = require('mongoose');

const user  = mongoose.Schema({
    uuid : {type : String,unique : true },
    author : {type : String, require : true},
    title : String,
    image : String,
    description : String,
})

module.exports = mongoose.model('blogData',user);
