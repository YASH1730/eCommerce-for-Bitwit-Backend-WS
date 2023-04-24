const { default: mongoose } = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const product = mongoose.Schema({
  SKU: { type: String, unique: true },
  ACIN: { type: String },
  CVW: { type: Number },
  product_title: { type: String },
  category_name: { type: String, default: "None" },
  category_id: { type: String, default: "None" },
  sub_category_name: { type: String, default: "None" },
  sub_category_id: { type: String, default: "None" },
  product_description: { type: String },
  dial: { type: Boolean, default : false },
  seo_title: { type: String },
  seo_description: { type: String },
  seo_keyword: { type: String },
  product_image: { type: Array, default: [] },
  featured_image: { type: String },
  mannequin_image: { type: String },
  specification_image: { type: String },
  primary_material: { type: Array, default: [] },
  primary_material_name: { type: String },
  warehouse: { type: Array, default: [] },
  warehouse_name: { type: String },
  length_main: { type: Number, default: 0 },
  breadth: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  bangalore_stock: { type: Number, default: 0 },
  jodhpur_stock: { type: Number, default: 0 },
  polish: { type: Array, default: [] },
  polish_name: { type: String },
  hinge: { type: String, default: "None" },
  hinge_qty: { type: Number, default: 0 },
  hinge_name: { type: String },
  knob: { type: String, default: "None" },
  knob_qty: { type: Number, default: 0 },
  knob_name: { type: String },
  handle: { type: String, default: "None" },
  handle_qty: { type: Number, default: 0 },
  handle_name: { type: String },
  door: { type: String, default: "None" },
  door_qty: { type: Number, default: 0 },
  door_name: { type: String },
  dial_name: { type: String, default : '' },
  fitting: { type: String, default: "None" },
  fitting_name: { type: String },
  selling_points: { type: Array, default: [] },
  dial_size: { type: Number, default: 0 },
  seating_size_width: { type: Number, default: 0 },
  seating_size_depth: { type: Number, default: 0 },
  seating_size_height: { type: Number, default: 0 },
  weight_capacity: { type: String },
  fabric: { type: String, default: "None" },
  fabric_qty: { type: Number, default: 0 },
  fabric_name: { type: String },
  wall_hanging: { type: Boolean, default: false },
  assembly_required: { type: String },
  assembly_part: { type: Number, default: 1 },
  legs: { type: String, default: "None" },
  mirror_length: { type: Number },
  mirror_width: { type: Number },
  silver_weight: { type: Number, default: 0 },
  joints: { type: String },
  upholstery: { type: Boolean, default : false },
  trolley: { type: Boolean,default : false },
  trolley_material: { type: String, default: "None" },
  rotating_seats: { type: Boolean, default: false },
  eatable_oil_polish: { type: Boolean, default: false },
  no_chemical: { type: Boolean, default: false },
  straight_back: { type: Boolean, default: false },
  lean_back: { type: Boolean, default: false },
  weaving: { type: Boolean, default: false },
  knife: { type: Boolean, default: false },
  not_suitable_for_Micro_Dish: { type: Boolean, default: false },
  tilt_top: { type: Boolean, default: false },
  inside_compartments: { type: Boolean, default: false },
  stackable: { type: Boolean, default: false },
  MRP: { type: Number, default: 0 },
  tax_rate: { type: Number, default: 0 },
  selling_price: { type: Number, default: 0 },
  showroom_price: { type: Number, default: 0 },
  discount_limit: { type: Number, default: 0 },
  polish_time: { type: Number, default: 0 },
  manufacturing_time: { type: Number, default: 0 },
  status: { type: Boolean, default: false },
  returnDays: { type: Number, default: 0 },
  COD: { type: Boolean, default: false },
  returnable: { type: Boolean, default: false },
  drawer: { type: String, default: "None" },
  drawer_count: { type: Number, default: 0 },
  mobile_store: { type: Boolean, default: true },
  online_store: { type: Boolean, default: true },
  range: { type: String, default: "None" },
  back_style: { type: String, default: "None" },
  package_length: { type: Number, default: 0 },
  package_height: { type: Number, default: 0 },
  package_breadth: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  unit: { type: String },
  assembly_level: { type: String },
  continue_selling: { type: Boolean, default: true },
  wheel: { type: String, default: "None" },
  wheel_included: { type: Boolean,default : false },
  wheel_qty: { type: String },
  wheel_name: { type: String, default: "None" },
  ceramic_tiles: { type: String, default: "None" },
  ceramic_tiles_qty: { type: Number, default: 0 },
  ceramic_tiles_included: { type: Boolean, default: false },
  ceramic_tiles_name: { type: String, default: "None" },
  ceramic_drawers: { type: String, default: "None" },
  ceramic_drawers_included: { type: Boolean, default: false },
  ceramic_drawers_name: { type: String, default: "None" },
  mattress: { type: String },
  mattress_length: { type: Number, default: 0 },
  mattress_breadth: { type: Number, default: 0 },
  plywood: { type: String },
  top_size_breadth: { type: Number, default: 0 },
  top_size_length: { type: Number, default: 0 },
  ceramic_drawers_qty: { type: Number, default: 0 },
  variations: { type: Array, default: [] },
  parent_SKU: { type: String, default: "" },
  amazon_url: { type: String, default: "" },
  flipkart_url: { type: String, default: "" },
  jiomart_url: { type: String, default: "" },
  wood_weight: { type: String, default: 0 },
  package_weight: { type: String, default: 0 },
  metal_weight: { type: String, default: 0 },
  dial_qty : {type : Number, default : 0},
  cane : {type : Boolean, default : false},
  cane_name : {type : String, default : ""},
  cane_qty : {type : Number, default : 0},
  hook : {type : Boolean, default : false},
  hook_name : {type : String, default : ""},
  hook_qty : {type : Number, default : 0},
  glass : {type : Boolean, default : false},
  glass_size : {type : Number, default : 0},
  green_glass : {type : Boolean, default : false},
  green_glass_size : {type : Number, default : 0},
  yellow_glass : {type : Boolean, default : false},
  yellow_glass_size : {type : Number, default : 0},
  red_glass : {type : Boolean, default : false},
  red_glass_size : {type : Number, default : 0},
  fitting_size : {type : Number, default : 0},
  mirror_size : {type : Number, default : 0},
  silver: { type: Boolean,default : false },
  mirror: { type: Boolean, default : false },
});

// module.exports = mongoose.model("product", product);
module.exports = mongoose.model("new_product", product);


