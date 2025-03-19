const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    doctorEmail: {
        type: String,
        required: true,
    },
    patientEmail: {
        type: String,
        required: true,
    },
    existing_status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        required: true
    },
    new_status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
