require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const testSignup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "test_" + Date.now() + "@example.com",
      phone: "1234567890",
      courseInterest: "Embedded",
      password: "password123"
    };

    console.log("Attempting to create user...");
    const user = await User.create(userData);
    console.log("User created successfully:", user._id);
    process.exit(0);
  } catch (error) {
    console.error("Signup failed with error:", error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

testSignup();
