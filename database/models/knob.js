const { default: mongoose } = require("mongoose");

const knob = mongoose.Schema({
   knob_name : {type: String ,unique : true},
   knob_status : {type :Boolean}
})

module.exports = mongoose.model('knob',knob);