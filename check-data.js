require("dotenv").config();
const mongoose = require("mongoose");

// Import Models
const User = require("./models/User");
const ContactMessage = require("./models/ContactMessage");
const TeacherApplication = require("./models/TeacherApplication");

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- DATABASE DATA SUMMARY ---");

    const userCount = await User.countDocuments();
    const contactCount = await ContactMessage.countDocuments();
    const hiringCount = await TeacherApplication.countDocuments();

    console.log(`Registered Users: ${userCount}`);
    console.log(`Contact Messages: ${contactCount}`);
    console.log(`Teacher Applications: ${hiringCount}`);

    if (userCount > 0) {
      console.log("\n--- RECENT USERS ---");
      const users = await User.find().limit(5).select("-password");
      console.table(users.map(u => ({ Name: `${u.firstName} ${u.lastName}`, Email: u.email })));
    }

    if (contactCount > 0) {
      console.log("\n--- RECENT CONTACT MESSAGES ---");
      const messages = await ContactMessage.find().limit(5);
      console.table(messages.map(m => ({ Name: m.name, Email: m.email, Subject: m.subject, Message: m.message })));
    }

    process.exit(0);
  } catch (error) {
    console.error("Error checking data:", error.message);
    process.exit(1);
  }
};

checkData();
