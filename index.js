require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Auth routes import
const expenseRoutes = require('./routes/expenseRoutes'); // Expense routes import

const app = express();
app.use(express.json());

// Use the routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api', expenseRoutes); // Expense routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
