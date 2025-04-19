const express = require('express');
const router = express.Router();

const { register, login, getProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Admin routes
router.get('/', auth, isAdmin, getAllUsers);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router; 