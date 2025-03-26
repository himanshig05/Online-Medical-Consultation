const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    document: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },  
    doctorEmail: { type: String, required: true },
    patientEmail: { type: String, required: true }
});

module.exports = mongoose.model("Media", mediaSchema);
