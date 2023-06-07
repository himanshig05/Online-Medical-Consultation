const mongoose = require("mongoose");

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect("mongodb://127.0.0.1:27017/doctorsDB");
  connection.isConnected = db.connections[0].readyState;
  console.log(connection.isConnected);
}

module.exports = dbConnect;
