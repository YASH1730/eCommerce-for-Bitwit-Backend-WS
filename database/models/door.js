const { default: mongoose } = require("mongoose");

const door = mongoose.Schema({
   door_name : {type: String ,unique : true},
   door_status : {type :Boolean}
})

module.exports = mongoose.model('door',door);