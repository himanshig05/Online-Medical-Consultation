const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const Doctor = require("./models/doctorModel");
const dbConnect = require("./utils/dbConnect");
const cors = require("cors");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

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
        name: req.body.name,
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

app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

app.listen(5000, function (req, res) {
  console.log("Server running on port 5000.");
});


const io = require("socket.io")(7000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  // connection
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and receive messages
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // disconnection
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});