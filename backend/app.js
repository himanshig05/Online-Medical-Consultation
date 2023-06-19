const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const Doctor = require("./models/doctorModel");
const dbConnect = require("./utils/dbConnect");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
dbConnect();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.get("/search", async function (req, res) {
  const doctors = await Doctor.find({});
  res.json({ data: doctors });
});

app.get("/search/:email", async function (req, res) {
  const email = req.params.email;
  const doctor = await Doctor.findOne({ email: email });
  res.json(doctor);
})

app.post("/create", async function (req, res) {
  const doctor = new Doctor({
    name: req.body.name,
    age: req.body.age,
    domain: req.body.domain,
    experience: req.body.experience,
    qualifications: req.body.qualifications,
    location: req.body.location,
    hours: req.body.hours
  });
  await doctor.save();
  res.json(doctor);
});

app.post("/create/:email", async function (req, res) {
  const doctor = new Doctor({
    email: req.params.email,
    name: req.body.name,
    age: req.body.age,
    domain: req.body.domain,
    experience: req.body.experience,
    qualifications: req.body.qualifications,
    location: req.body.location,
    hours: req.body.hours,
  });
  await doctor.save();
  res.json(doctor);
});

app.post("/update/:email", async function (req, res) {
  const doctor = await Doctor.findOneAndUpdate(
    {
      email: req.params.email,
    },
    {
      $set: {
        name: req.params.name,
        age: req.body.age,
        domain: req.body.domain,
        experience: req.body.experience,
        qualifications: req.body.qualifications,
        location: req.body.location,
        hours: req.body.hours,
      },
    },
    {
      new: true,
    }
  );
  res.json(doctor);
});

app.listen(5000, function (req, res) {
  console.log("Server running on port 5000.");
});
