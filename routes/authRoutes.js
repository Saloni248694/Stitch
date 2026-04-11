const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Helper to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty().trim(),
    check("lastName", "Last name is required").not().isEmpty().trim(),
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({
      min: 6,
    }),
  ],
  validate,
  async (req, res) => {
    const { firstName, lastName, email, phone, courseInterest, password } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        courseInterest,
        password,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Auth user & get token
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("password", "Password is required").exists(),
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

const passport = require("passport");

// @route   GET /api/auth/google
// @desc    Authenticate with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => {
    // Successful authentication
    const token = generateToken(req.user._id);
    // Redirect to home page with token
    res.redirect(`/?token=${token}`);
  }
);

module.exports = router;

