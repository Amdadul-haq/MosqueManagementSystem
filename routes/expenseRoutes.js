const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createExpense, getExpensesByMonth } = require("../controllers/expenseController");

// 🔐 Create new expense
router.post("/", authMiddleware, createExpense);

// (GET route will be added next)
router.get("/", authMiddleware, getExpensesByMonth);


module.exports = router;
