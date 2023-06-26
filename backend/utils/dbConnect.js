const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true,});
  connection.isConnected = db.connections[0].readyState;
  console.log(connection.isConnected);
}

module.exports = dbConnect;
