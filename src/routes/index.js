const express = require('express');
const router = express.Router();
const { registerDonor, searchDonors } = require('../controllers/index');
const authController = require('../controllers/auth');
const { ensureAuth } = require('../middleware/auth');

// Donor routes - protected by JWT auth
router.post('/donor/register', ensureAuth, registerDonor);
router.get('/donor/search', ensureAuth, searchDonors);

// Also support legacy routes for compatibility
router.post('/register', ensureAuth, registerDonor);
router.get('/search', ensureAuth, searchDonors);

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', ensureAuth, authController.me);

module.exports = router;
