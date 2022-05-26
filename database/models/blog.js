const mongoose = require('mongoose');

const user  = mongoose.Schema({
    uuid : {type : String,unique : true },
    title : String,
    card_image : String,
    card_description : String,
    description : String,
})

module.exports = mongoose.model('blogData',user);
