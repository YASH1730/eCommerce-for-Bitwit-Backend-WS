const { default: mongoose } = require("mongoose");

const polish = mongoose.Schema({
   polish_name: { type: String },
   polish_type: { type: String, default: 'None' },
   polish_finish: { type: String, default: 'None' },
   level: { type: String, default: 'None' },
   outDoor_image: { type: Array, default: [] },
   inDoor_image: { type: Array, default: [] },
   lock: { type: Boolean, default: false },
   price: { type: Number, default: 0 }
})

module.exports = mongoose.model('  polish', polish);