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
// UPDATE expense
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, expense_date } = req.body;

  if (!title || !amount || !expense_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `UPDATE expenses
       SET title = $1, amount = $2, category = $3, expense_date = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, amount, category, expense_date, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE expense
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM expenses
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
