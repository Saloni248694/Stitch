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

// ======================
// ✅ CONNECT DATABASE
// ======================
connectDB();

// ======================
// ✅ MIDDLEWARE
// ======================

// Security
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// CORS
app.use(cors());

// Body parsers (IMPORTANT)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middlewares
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
});
app.use("/api", limiter);

// Sessions
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

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ======================
// ✅ ROUTES
// ======================

// Debug logger (IMPORTANT)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/payments", paymentRoutes);

// ======================
// ✅ FIX RENDER HEALTH CHECK
// ======================
app.head("/", (req, res) => {
  res.status(200).end();
});

// ======================
// ✅ STATIC FILES
// ======================
app.use(express.static(path.join(__dirname)));

// ======================
// ✅ FRONTEND ROUTE
// ======================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ======================
// ✅ ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Server Error" });
});

// ======================
// ✅ START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
