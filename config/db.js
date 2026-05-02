const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
<<<<<<< HEAD
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
=======
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // process.exit(1);
>>>>>>> 273d2e2 (first commit)
  }
};

module.exports = connectDB;
