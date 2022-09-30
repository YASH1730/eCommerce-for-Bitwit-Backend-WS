const { default: mongoose } = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const mergeproducts = mongoose.Schema({
    MS : {required : true, type : String, unique: true},
    SKU : {required : true, type : String, unique: true},
    product_array : {required : true, type : String},
    product_title : {required : true, type : String},
    category_name : { type : String},
    bangalore_stock : { type : Number},
    polish_time : { type : Number},
    jodhpur_stock : { type : Number},
    manufacturing_time: {required : true, type : String},
    category_id : { type : String},
    sub_category_name : { type : String},
    sub_category_id : {type : String},
    product_description : {type : String},
    seo_title : { type : String},
    seo_description : { type : String},
    seo_keyword : { type : String},
    product_image : {required : true, type : Array},
    featured_image : {required : true, type : String},
    mannequin_image : {required : true, type : String},
    specification_image : {required : true, type : String},
    selling_points : { type : String},
    rotating_seats : { type : Boolean},
    eatable_oil_polish : { type : Boolean},
    no_chemical : { type : Boolean},
    straight_back : { type : Boolean},
    lean_back : { type : Boolean},
    weaving : { type : Boolean},
    knife : { type : Boolean},
    not_suitable_for_Micro_Dish : { type : Boolean},
    tilt_top : { type : Boolean},
    inside_compartments : { type : Boolean},
    stackable : { type : Boolean},
    MRP : {required : true, type : Number},
    tax_rate : {required : true, type : Number},
    selling_price : {required : true, type : Number},
    showroom_price : {required : true, type : Number},
    discount_limit : {required : true, type : Number},
    status : {required : true, type : Boolean},
    returnDays : {type : Number},
    warehouse : { type : String},
    COD : {type : Boolean},
    returnable : {type : Boolean},
})

module.exports = mongoose.model('mergeproducts',mergeproducts);