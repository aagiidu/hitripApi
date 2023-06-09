const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    code: {type: String, unique: true},
    name: {type: String, required:true},
    honog: {type: String},
    urt: {type: String},
    chiglel: {type: String},
    images: {type: Array},
    featured: {type: Number, default: 0},
    active: {type: Number, default: 1},
    marshrut: {type: String},
    desc: {type: String},
    timestamp: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Trip", TripSchema);