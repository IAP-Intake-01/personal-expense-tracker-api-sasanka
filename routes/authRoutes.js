const express = require('express');
const { register, login, updateUser, deleteUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update-user', verifyToken, updateUser);
router.delete('/delete-user', verifyToken, deleteUser);

module.exports = router;
