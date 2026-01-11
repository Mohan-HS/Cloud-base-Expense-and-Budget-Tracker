const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE expense
router.post("/", authMiddleware, async (req, res) => {
  const { title, amount, category, expense_date } = req.body;

  if (!title || !amount || !expense_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, title, amount, category, expense_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.userId, title, amount, category, expense_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM expenses
       WHERE user_id = $1
       ORDER BY expense_date DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
