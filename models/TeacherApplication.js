const mongoose = require("mongoose");

const TeacherApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  expertise: { type: String, required: true },
  linkedin: { type: String },
  experience: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("TeacherApplication", TeacherApplicationSchema);
