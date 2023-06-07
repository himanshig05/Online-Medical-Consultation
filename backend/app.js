const express = require("express");
const mongoose = require("mongoose");
const Doctor = require("./models/doctorModel");
const dbConnect = require("./utils/dbConnect");
const cors = require("cors");

const app = express();
dbConnect();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.get("/search", async function (req, res) {
  const doctors = await Doctor.find({});
  res.json({ data: doctors });
});

app.listen(5000, function (req, res) {
  console.log("Server running on port 5000.");
});
