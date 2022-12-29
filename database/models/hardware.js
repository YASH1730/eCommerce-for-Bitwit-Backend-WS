const { default: mongoose } = require("mongoose");

const hardware = mongoose.Schema({
    SKU: { required: true, type: String, unique: true },
    title: { required: true, type: String },
    category_name: { type: String },
    category_id: { type: String },
    sub_category_name: { type: String },
    sub_category_id: { type: String },
    hardware_image: { required: true, type: Array },
    warehouse: { type: Array, default: [] },
    bangalore_stock: { type: Number },
    jodhpur_stock: { type: Number },
    manufacturing_time: { required: true, type: String },
    status: { required: true, type: Boolean },
    returnDays: { type: Number },
    COD: { type: Boolean },
    returnable: { type: Boolean },
    quantity: { type: Number },
    package_length: { type: Number },
    package_height: { type: Number },
    package_breadth: { type: Number },
    unit: { type: String },
    selling_price: { type: Number },
    showroom_price: { type: Number },
    polish_time: { type: Number },
    restocking_time: { type: Number, default: 0 },
    selling_points: { type: Array, default: [] },
    seo_title: { type: String },
    seo_description: { type: String },
    seo_keyword: { type: String },
    hardware_polish: { type: String, default: "None" },
    min_quantity: { type: Number, default: 1 },
    continue_selling: { type: Boolean, default: false }
})

module.exports = mongoose.model('hardware', hardware);