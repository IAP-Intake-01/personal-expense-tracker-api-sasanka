const express = require('express');
const { addExpense, getExpensesByCategory, getMonthlyExpenses, getAllExpenses, updateExpense, deleteExpense } = require('../controllers/expensesController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add-expense', verifyToken, addExpense);
router.get('/get-expenses-by-category', verifyToken, getExpensesByCategory);
router.get('/get-monthly-expenses', verifyToken, getMonthlyExpenses);
router.get('/get-all-expenses', verifyToken, getAllExpenses);
router.put('/update-expense/:id', verifyToken, updateExpense);
router.delete('/delete-expense/:id', verifyToken, deleteExpense);

module.exports = router;
