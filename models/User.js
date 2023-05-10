const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone:{type: Number, required:true, unique:true},
    password: {type: String, required:true},
    status: {type: Number, default: 0},
    package: {type: Number, default: 0}
});

module.exports = mongoose.model("User", userSchema);
