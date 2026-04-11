require("dotenv").config();

// Check for required Google OAuth credentials
if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes("your_google_client_id_here")) {
  console.warn("\x1b[33m%s\x1b[0m", "WARNING: Google OAuth Client ID is missing or using placeholder! Google Login will not work.");
}
if (!process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET.includes("your_google_client_secret_here")) {
  console.warn("\x1b[33m%s\x1b[0m", "WARNING: Google OAuth Client Secret is missing or using placeholder! Google Login will not work.");
}
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");

// Passport config
require("./config/passport")(passport);

// Import Routes
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Connect to MongoDB
connectDB();

// 1. Set security HTTP headers with custom CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://cdn.razorpay.com", "https://cdnjs.cloudflare.com"],
        scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers (onclick, onsubmit)
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https://*.razorpay.com", "https://cdn.razorpay.com", "https://*.google.com", "https://www.google.com"],
        connectSrc: ["'self'", "https://lumberjack.razorpay.com", "https://api.razorpay.com", "https://checkout-static-next.razorpay.com", "https://accounts.google.com"],
        frameSrc: ["'self'", "https://api.razorpay.com", "https://accounts.google.com"],

      },
    },
  })
);



// 2. CORS configuration (Restrict as needed)
app.use(cors());

// 3. Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" })); // Limit body size to 10kb

// 4. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 5. Data sanitization against XSS
app.use(xss());

// 6. Prevent HTTP Parameter Pollution
app.use(hpp());

// 7. Limit requests from same API (Rate Limiting)
const limiter = rateLimit({
  max: 100, // max 100 requests
  windowMs: 60 * 60 * 1000, // in 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secure_session_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevent XSS from reading cookies
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: "strict", // Prevent CSRF
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/payments", paymentRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("ERROR 💥", err);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status: status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: Don't leak error details
    res.status(statusCode).json({
      status: status,
      message: err.isOperational ? err.message : "Something went very wrong!",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

