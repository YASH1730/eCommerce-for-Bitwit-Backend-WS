const mongoose = require('mongoose');

const user  = mongoose.Schema({
    uuid : {type : String,unique : true },
    seo_title : String,
    seo_description : String,
    title : String,
    card_image : String,
    card_description : String,
    description : String,
    
})

module.exports = mongoose.model('blogData',user);
