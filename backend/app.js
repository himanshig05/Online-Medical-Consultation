const express = require("express");
const bodyParser = require("body-parser")
const dbConnect = require("./utils/dbConnect");
const initializeSocket = require("./utils/socket.js");
const cors = require("cors");


const doctorRoutes=require("./routes/doctor.js");
const patientRoutes=require("./routes/patient.js");
const prescriptionRoutes=require("./routes/prescription.js");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes= require("./routes/reviewRoutes");
const requestRoutes = require("./routes/requestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");



const app = express();

const server = require("http").Server(app);
const io=initializeSocket(server);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
dbConnect();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.use("/",doctorRoutes);
app.use("/",patientRoutes); //using the same root since the subsequent routes are different, no overlap
app.use("/",prescriptionRoutes);
// CHAT ROUTES
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/rating",reviewRoutes);

app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
// const PORT = process.env.PORT || 5002;
server.listen(PORT, function (req, res) {
  console.log(`Server running on port ${PORT}.`);
});
app.get("/", (req, res) => {
  res.send("Server is running!");
});
