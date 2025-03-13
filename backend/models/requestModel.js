const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    doctorEmail: {
        type: String,
        required: true,
      },
      patientEmail: {
        type: String,
        required: true,
      },
    status: {
        type: String,
        enum: ['active', 'pending', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
