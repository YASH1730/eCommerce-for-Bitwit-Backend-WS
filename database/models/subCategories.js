const { default: mongoose } = require("mongoose");

const subCategories = mongoose.Schema({
    category_id: { required: true, type: String },
    category_name: { required: true, type: String },
    sub_category_name: { required: true, type: String, unique: true },
    sub_category_status: { required: true, type: Boolean },
    seo_title: { type: String, default: '' },
    seo_description: { type: String, default: '' },
    seo_keyword: { type: String, default: '' },
    product_description: { type: String, default: '' },

})

module.exports = mongoose.model('subCategories', subCategories);