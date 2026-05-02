const express = require("express");
const { check, validationResult } = require("express-validator");
const TeacherApplication = require("../models/TeacherApplication");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

// Validation helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation Error:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ======================
// ✅ HIRING FORM
// ======================
router.post(
  "/hiring",
  [
    check("name").notEmpty(),
    check("email").isEmail(),
    check("phone").notEmpty(),
    check("expertise").notEmpty(),
    check("experience").notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      console.log("HIRING DATA:", req.body);

      await TeacherApplication.create(req.body);

      res.status(201).json({ message: "Application submitted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ======================
// ✅ CONTACT FORM
// ======================
router.post(
  "/contact",
  [
    check("name").notEmpty(),
    check("email").isEmail(),
    check("message").notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      console.log("CONTACT DATA:", req.body);

      await ContactMessage.create(req.body);

      res.status(201).json({ message: "Message sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
