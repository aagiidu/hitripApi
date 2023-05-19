const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {type: String, required:true},
    description: {type: String, required:true},
    image: {type: String},
    timestamp: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Blog", BlogSchema);