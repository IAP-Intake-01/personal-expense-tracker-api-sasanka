require('dotenv').config();
const cors = require('cors');
const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const expenseRoutes = require('./routes/expenseRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api', authRoutes); 
app.use('/api', expenseRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
