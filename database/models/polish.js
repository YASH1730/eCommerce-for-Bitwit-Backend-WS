const { default: mongoose } = require("mongoose");

const polish = mongoose.Schema({
   polish_name : {type: String ,unique : true},
   polish_status : {type :Boolean}
})

module.exports = mongoose.model('  polish',polish);