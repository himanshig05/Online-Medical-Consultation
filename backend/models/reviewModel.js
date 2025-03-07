const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  doctorEmail: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
  },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
module.exports = Review;
