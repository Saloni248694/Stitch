const express = require("express");
const { check, validationResult } = require("express-validator");
const TeacherApplication = require("../models/TeacherApplication");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

// Helper to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   POST /api/forms/hiring
// @desc    Submit teacher application
router.post(
  "/hiring",
  [
    check("name", "Name is required").not().isEmpty().trim(),
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("phone", "Valid phone number is required").not().isEmpty().trim(),
    check("expertise", "Expertise is required").not().isEmpty().trim(),
    check("experience", "Experience details are required").not().isEmpty().trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, phone, expertise, linkedin, experience } = req.body;
      const application = await TeacherApplication.create({
        name,
        email,
        phone,
        expertise,
        linkedin,
        experience,
      });
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Hiring form error:", error);
      res.status(500).json({ message: "Server error during submission" });
    }
  }
);

// @route   POST /api/forms/contact
// @desc    Submit contact message
router.post(
  "/contact",
  [
    check("name", "Name is required").not().isEmpty().trim(),
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("message", "Message is required").not().isEmpty().trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const contactMessage = await ContactMessage.create({
        name,
        email,
        subject,
        message,
      });
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Server error during submission" });
    }
  }
);

module.exports = router;

