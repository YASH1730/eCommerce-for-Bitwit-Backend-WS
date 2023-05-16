const { default: mongoose } = require("mongoose");

const chat = mongoose.Schema({
  from : {type : String},
  to : {type : String},
  sender_email : {type : String},
  receiver_email : {type : String},
  message : {type : String},
  time : {type : Date, default : Date.now()}
});

module.exports = mongoose.model("chat",chat);
