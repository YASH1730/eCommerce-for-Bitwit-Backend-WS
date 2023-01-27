const { default: mongoose } = require("mongoose");

const logging = mongoose.Schema({
    email: { type: String, default: '' },
    role: { type: String, default: '' },
    ip: { type: String, default: '' },
    location: { type: Object, default: '' },
    city: { type: String, default: '' },
    logTime: { type: Date, default: Date.now },
})

module.exports = mongoose.model('logging', logging);