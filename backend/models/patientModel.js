const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  bloodGroup: {
    type: String,
  },
  conditions: {
    type: String,
  },
  picturePath: {
    type: String,
    default: "",
  },
  prescriptions:[{ //array of prescriptions
    date: {
      type: String,
    },
    medicine: {
        type: String,
    },
    duration: {
        type: String,
    },
    amount: {
        type: String,
    },
    doctor: {
        type: String,
    },
    status: {
        type: String
    }
    }],
});

const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);

module.exports = Patient;
