const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
});

const paymentSchema = new mongoose.Schema({
    doctorEmail: { type: String, required: true },
    transactions: [transactionSchema] // Array of payments made to this doctor
});

const patientSchema = new mongoose.Schema(
    {   
        patientEmail: { type: String, required: true },
        payments: [paymentSchema] // Array of payments grouped by doctor
    },
    { timestamps: true }
);

const PatientPay = mongoose.model("PatientPay", patientSchema);
module.exports = PatientPay;
