const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    fbid: {type: Number, required:true},
    invoiceId: {type: String, required:true},
    tripCode: {type: String, required:true},
    amount: {type: Number, required:true},
    status: {type: Number, default: 0},
    timestamp: {type: Date, default: new Date()}
});

module.exports = mongoose.model("Invoice", InvoiceSchema);