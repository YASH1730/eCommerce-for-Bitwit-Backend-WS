const { default: mongoose } = require("mongoose");

const handle = mongoose.Schema({
   handle_name : {type: String ,unique : true},
   handle_status : {type :Boolean}
})

module.exports = mongoose.model('handle',handle);