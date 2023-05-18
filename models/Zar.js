const mongoose = require("mongoose");

const zarSchema = new mongoose.Schema({
    body: {type: String, required:true},
    name: {type: String},
    fbid: {type: String},
    featured: {type: Number, default: 0},
    timestamp: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Zar", zarSchema);