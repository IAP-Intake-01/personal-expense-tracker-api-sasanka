const db = require('../config/db');

// Add expense
exports.addExpense = (req, res) => {
    const { category, amount, description } = req.body;
    const userId = req.user.id;

    // Get the current date and time
    const currentDate = new Date(); 

    db.query(
        'INSERT INTO expenses (user_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
        [userId, category, amount, currentDate, description], 
        (err) => {
            if (err) return res.status(500).send('Failed to add expense');
            res.send('Expense added successfully');
        }
    );
};

// Get expenses by category
exports.getExpensesByCategory = (req, res) => {
    const userId = req.user.id; // 

    db.query(
        'SELECT category, SUM(amount) AS total_amount FROM expenses WHERE user_id = ? GROUP BY category',
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).send('Failed to retrieve expenses');
            }
            res.json(results); 
        }
    );
};

// Current Month Expenses 
exports.getCurrentMonthExpensesByCategory = (req, res) => {
    const userId = req.user.id; 
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear(); 

    db.query(
        'SELECT category, SUM(amount) AS total_amount FROM expenses WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY category',
        [userId, currentMonth, currentYear],
        (err, results) => {
            if (err) {
                return res.status(500).send('Failed to retrieve expenses');
            }
            res.json(results); 
        }
    );
};

// Expenses By Month
exports.getExpensesByMonth = (req, res) => {
    const userId = req.user.id; 
    const { month, year } = req.query;

    // Validate month and year
    if (!month || !year || month < 1 || month > 12) {
        return res.status(400).send('Invalid month or year');
    }

    db.query(
        'SELECT category, SUM(amount) AS total_amount FROM expenses WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY category',
        [userId, month, year],
        (err, results) => {
            if (err) {
                return res.status(500).send('Failed to retrieve expenses');
            }
            res.json(results);
        }
    );
};

// Get expenses grouped by month
exports.getMonthlyExpenses = (req, res) => {
    const userId = req.user.id;

    db.query(
        `SELECT MONTH(date) AS month, SUM(amount) AS total
         FROM expenses WHERE user_id = ? GROUP BY MONTH(date)`,
        [userId],
        (err, results) => {
            if (err) return res.status(500).send('Failed to fetch data');
            res.json(results);
        }
    );
};

// Update an expense
exports.updateExpense = (req, res) => {
    const expenseId = req.params.id;
    const { category, amount, description } = req.body;

    // Get the current date and time for the update
    const currentDate = new Date(); 
    db.query(
        'UPDATE expenses SET category = ?, amount = ?, date = ?, description = ? WHERE id = ?',
        [category, amount, currentDate, description, expenseId], 
        (err, result) => {
            if (err) {
                console.error(err); 
                return res.status(500).send('Failed to update expense');
            }
            res.send('Expense updated successfully with current date');
        }
    );
};

// Delete an expense
exports.deleteExpense = (req, res) => {
    const expenseId = req.params.id;

    db.query('DELETE FROM expenses WHERE id = ?', [expenseId], (err, result) => {
        if (err) {
            return res.status(500).send('Failed to delete expense');
        }
        res.send('Expense deleted successfully');
    });
};

// Get all expenses for the authenticated user
exports.getAllExpenses = (req, res) => {
    const userId = req.user.id;

    db.query('SELECT * FROM expenses WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Failed to retrieve expenses');
        }
        res.json(results);
    });
};
