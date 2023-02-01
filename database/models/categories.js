const { default: mongoose } = require("mongoose");

const categories = mongoose.Schema({
    category_name: { required: true, type: String, unique: true },
    category_status: { required: true, type: Boolean },
    category_image: { type: String },
    discount_limit: { type: Number, default: 0 },
    seo_title: { type: String, default: '' },
    seo_description: { type: String, default: '' },
    seo_keyword: { type: String, default: '' },
    product_description: { type: String, default: '' },
})

module.exports = mongoose.model('categories', categories);