const { default: mongoose } = require("mongoose");

const fitting = mongoose.Schema({
   fitting_name : {type: String ,unique : true},
   fitting_status : {type :Boolean}
})

module.exports = mongoose.model('fitting',fitting);