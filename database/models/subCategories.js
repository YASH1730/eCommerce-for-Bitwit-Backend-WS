const { default: mongoose } = require("mongoose");

const subCategories = mongoose.Schema({
    category_id: { type: String },
    category_name: { type: String },
    sub_category_image: { type: String },
    sub_category_name: { type: String, unique: true },
    sub_category_status: { type: Boolean },
    seo_title: { type: String, default: '' },
    seo_description: { type: String, default: '' },
    seo_keyword: { type: String, default: '' },
    product_description: { type: String, default: '' },

})

module.exports = mongoose.model('subCategories', subCategories);