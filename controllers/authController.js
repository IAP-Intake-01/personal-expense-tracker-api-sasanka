const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Token නිර්මාණය කිරීමේ ෆන්ක්ෂනය
const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username or email already exists');
                }
                return res.status(500).send('User registration failed');
            }
            res.send('User registered successfully');
        }
    );
};

// Login an existing user
exports.login = (req, res) => {
    const { identifier, password } = req.body;

    // පරිශීලකයා username හෝ ඊ-මේල් අනුව සොයාගන්න
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid credentials'); 
        }

        const user = results[0];

        // ලබාදී ඇති මුරපදය හා සුරක්ෂිත මුරපදය සමඟ සමාන වන්නේදැයි පරීක්ෂා කිරීම
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send('Invalid credentials'); 
            }

            // සාර්ථක නම්, token එකක් නිර්මාණය කරන්න
            const token = generateToken(user);  
            res.json({ token });
        });
    });
};

// Update user details
exports.updateUser = (req, res) => {
    const { username, email, password } = req.body;
    // Token වලින් id ලබා ගන්න
    const userId = req.user.id; 

    let updateQuery = 'UPDATE users SET';
    const fields = [];
    const values = [];

    // Optional fields
    if (username) {
        fields.push(' username = ? ');
        values.push(username);
    }
    if (email) {
        fields.push(' email = ? ');
        values.push(email);
    }
    if (password) {
        fields.push(' password = ? ');
        // Password hash කරන්න
        values.push(bcrypt.hashSync(password, 10)); 
    }

    if (fields.length === 0) {
        return res.status(400).send('No fields to update');
    }

    updateQuery += fields.join(', ') + ' WHERE id = ?';
    values.push(userId);

    db.query(updateQuery, values, (err, result) => {
        if (err) {
            return res.status(500).send('Failed to update user');
        }
        res.send('User updated successfully');
    });
};

// Delete user
exports.deleteUser = (req, res) => {
    // Token වලින් id ලබා ගන්න
    const userId = req.user.id; 

    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).send('Failed to delete user');
        }
        res.send('User deleted successfully');
    });
};


