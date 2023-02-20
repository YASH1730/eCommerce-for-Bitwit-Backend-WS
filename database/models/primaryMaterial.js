const { default: mongoose } = require("mongoose");

const primaryMaterial = mongoose.Schema({
  primaryMaterial_name: { type: String, unique: true },
  primaryMaterial_description: { type: String, default: "" },
  primaryMaterial_image: { type: String, default: "" },
  primaryMaterial_status: { type: Boolean },
  customizations: { type: Boolean, default: false },
});

module.exports = mongoose.model("primaryMaterial", primaryMaterial);
