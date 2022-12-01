const { default: mongoose } = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const draft = mongoose.Schema({
   DID : {type: String, unique : true},
   AID : {type : String},
   type : {type : String},
   operation  : {type : String},
   payload : {type : String},
   draftStatus : {type: String, default : 'Pending'},
   message : {type : String}
},{timestamps: {
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }})

module.exports = mongoose.model('draft',draft);