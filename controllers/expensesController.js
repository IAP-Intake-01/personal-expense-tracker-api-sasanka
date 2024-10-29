const db = require('../config/db');

exports.addExpense = (req, res) => {
    const { category, amount, description } = req.body;
    const userId = req.user.id;
    
    // Get the current date and time
    const currentDate = new Date(); // Create a new Date object

    db.query(
        'INSERT INTO expenses (user_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
        [userId, category, amount, currentDate, description], // Use currentDate here
        (err) => {
            if (err) return res.status(500).send('Failed to add expense');
            res.send('Expense added successfully');
        }
    );
};

// Get expenses by category
exports.getExpensesByCategory = (req, res) => {
    const userId = req.user.id; // Use the id from the verified token

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
    const currentDate = new Date(); // Automatically generate the current date

    db.query(
        'UPDATE expenses SET category = ?, amount = ?, date = ?, description = ? WHERE id = ?',
        [category, amount, currentDate, description, expenseId], // Update to use currentDate
        (err, result) => {
            if (err) {
                console.error(err); // Log the error to the console
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
