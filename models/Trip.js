const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    code: {type: String},
    name: {type: String, required:true},
    honog: {type: String},
    urt: {type: String},
    chiglel: {type: String},
    marshrut: {type: String},
    desc: {type: String},
    image: {type: String},
    featured: {type: Number, default: 0},
    active: {type: Number, default: 1},
    timestamp: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Trip", TripSchema);