const express = require('express');
const { 
    addExpense, 
    getExpensesByCategory, 
    getMonthlyExpenses, 
    getAllExpenses, 
    updateExpense, 
    deleteExpense, 
    getCurrentMonthExpensesByCategory,  
    getExpensesByMonth                   
} = require('../controllers/expensesController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Define routes
router.post('/add-expense', verifyToken, addExpense);
router.get('/get-expenses-by-category', verifyToken, getExpensesByCategory);
router.get('/get-monthly-expenses', verifyToken, getMonthlyExpenses);
router.get('/get-all-expenses', verifyToken, getAllExpenses);
router.put('/update-expense/:id', verifyToken, updateExpense);
router.delete('/delete-expense/:id', verifyToken, deleteExpense);


router.get('/expenses-current-month', verifyToken, getCurrentMonthExpensesByCategory); 
router.get('/expenses-by-month', verifyToken, getExpensesByMonth); 

module.exports = router;
