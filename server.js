require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const passport = require("passport");
const session = require("express-session");

// DB
const connectDB = require("./config/db");

// Passport config
require("./config/passport")(passport);

// Routes
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Connect DB (don’t crash if fails)
connectDB().catch(err => {
  console.error("MongoDB connection failed:", err.message);
});

// ✅ Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
          "https://cdn.razorpay.com",
          "https://cdnjs.cloudflare.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://*.razorpay.com",
          "https://cdn.razorpay.com",
          "https://*.google.com",
        ],
        connectSrc: [
          "'self'",
          "https://api.razorpay.com",
          "https://accounts.google.com",
        ],
        frameSrc: [
          "'self'",
          "https://api.razorpay.com",
          "https://accounts.google.com",
        ],
      },
    },
  })
);

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ✅ Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests, try again later",
});
app.use("/api", limiter);

// ✅ Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/payments", paymentRoutes);

//
// 🔥 IMPORTANT PART (FRONTEND FIX)
//

// ✅ Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// ✅ Handle Render health check
app.head("/", (req, res) => {
  res.status(200).end();
});

// ✅ Load homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Catch-all route (important for navigation)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Something went wrong" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
