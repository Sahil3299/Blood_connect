const express = require('express');
const router = express.Router();
const { signup, login, logout, me } = require('../controllers/auth');
const { ensureAuth } = require('../middleware/auth');

// Public routes
router.post('/register', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected route
router.get('/me', ensureAuth, me);

module.exports = router;
