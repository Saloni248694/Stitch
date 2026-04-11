require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection with URI:", process.env.MONGO_URI ? "Found" : "Missing");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("SUCCESS: MongoDB Connected!");
    process.exit(0);
  } catch (error) {
    console.error("FAILURE: MongoDB connection error:", error.message);
    process.exit(1);
  }
};

testConnection();
