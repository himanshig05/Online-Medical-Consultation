const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' }
});

const paymentSchema = new mongoose.Schema({
    patientEmail: { type: String, required: true },
    transactions: [transactionSchema] // Array of payments made by this patient
});

const doctorSchema = new mongoose.Schema(
    {   
        doctorEmail: { type: String, required: true },
        payments: [paymentSchema] // Array of payments grouped by patient
    },
    { timestamps: true }
);

const DoctorPay = mongoose.model("DoctorPay", doctorSchema);
module.exports = DoctorPay;
