const { default: mongoose } = require("mongoose");

const hinge = mongoose.Schema({
   hinge_name : {type: String ,unique : true},
   hinge_status : {type :Boolean}
})

module.exports = mongoose.model('hinge',hinge);