const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  domain: {
    type: String,
  },
  experience: {
    type: Number,
  },
  qualifications: {
    type: String,
  },
  location: {
    type: String,
  },
  hours: {
    type: String,
  },
  picturePath: {
    type: String,
    default: "",
  },
  averageRating: {
    type: Number,
    default: 0, 
  },
});

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
