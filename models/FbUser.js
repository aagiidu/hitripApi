const mongoose = require("mongoose");

const FbUserSchema = new mongoose.Schema({
    fbid:{type: Number, required:true, unique:true},
    name: {type: String},
    email: {type: String},
    image: {type: String},
    status: {type: Number, default: 0},
    trips: {type: Array}
});

module.exports = mongoose.model("FbUser", FbUserSchema);
