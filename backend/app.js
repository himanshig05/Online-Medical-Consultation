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

app.post("/update/:name", async function (req, res) {
  const doctor = await Doctor.findOneAndUpdate(
    {
      name: req.params.name,
    },
    {
      $set: {
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
