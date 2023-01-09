const { default: mongoose } = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const mergeproducts = mongoose.Schema({
    M: { required: true, type: String, unique: true },
    product_articles: { type: Array, default: [] },
    product_title: { type: String },
    category_name: { type: String },
    category_id: { type: String },
    sub_category_name: { type: String },
    sub_category_id: { type: String },
    warehouse: { type: Array, default: [] },
    warehouse_name: { type: String },
    bangalore_stock: { type: Number, default: 0, },
    jodhpur_stock: { type: Number, default: 0, },
    product_description: { type: String },
    product_image: { type: Array },
    featured_image: { type: String },
    mannequin_image: { type: String },
    specification_image: { type: String },
    selling_points: { type: Array, default: [] },
    selling_price: { type: Number },
    showroom_price: { type: Number },
    discount_limit: { type: Number },
    mobile_store: { type: Boolean },
    online_store: { type: Boolean },
    continue_selling: { type: Boolean, default: true },
    COD: { type: Boolean, default: false },
    returnDays: { type: Number, default: 0 },
    returnable: { type: Boolean, default: false },
    polish_time: { type: Number, default: 0 },
    manufacturing_time: { type: Number, default: 0 },
    package_length: { type: Number, default: 0 },
    package_height: { type: Number, default: 0 },
    package_breadth: { type: Number, default: 0 },
    seo_title: { type: String },
    seo_description: { type: String },
    seo_keyword: { type: String },



})

module.exports = mongoose.model('mergeproducts', mergeproducts);