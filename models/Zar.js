const mongoose = require("mongoose");

const zarSchema = new mongoose.Schema({
    title:{type: String, required:true},
    body: {type: String, required:true},
    phone: {type: Number},
    featured: {type: Number, default: 0},
    timestamp: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Zar", zarSchema);