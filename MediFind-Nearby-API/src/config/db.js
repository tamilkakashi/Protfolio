const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and configure it.");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log("MongoDB connected");
}

module.exports = connectDB;
