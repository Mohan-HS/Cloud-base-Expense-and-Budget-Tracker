require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pool = require('./db');
const authRoutes = require("./routes/auth");

const app = express();

// FIRST: Normalize URLs - remove trailing whitespace/newlines BEFORE route matching
app.use((req, res, next) => {
  // Decode and clean the URL
  try {
    const decoded = decodeURIComponent(req.url);
    req.url = decoded.replace(/[\r\n\t\s]+$/, '');
    // Force Express to re-parse the cleaned URL
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    req.path = urlObj.pathname;
  } catch (e) {
    // If URL parsing fails, just trim
    req.url = req.url.replace(/[\r\n\t\s]+$/, '');
  }
  console.log(`${req.method} ${req.path}`);
  next();
});

// middleware
app.use(cors());
app.use(express.json());

// Database connection check
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("DB connected at:", res.rows[0].now);
  }
});

// routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test route - get all users
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth routes
app.use("/api/auth", authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    userId: req.userId,
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
