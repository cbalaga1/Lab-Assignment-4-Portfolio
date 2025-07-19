// --- routes/authRoutes.js ---
// Defines the API routes for authentication

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // For protected routes

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', authController.signin);

// @route   GET /api/auth/signout
// @desc    Sign out user (client-side token removal)
// @access  Public (client removes token, server confirms)
router.get('/signout', authController.signout);

// Example of a protected route
// This route will only be accessible if a valid JWT token is provided in the header
router.get('/protected', authMiddleware, (req, res) => {
    res.json({
        message: 'You have accessed a protected route!',
        user: req.user // req.user is set by the authMiddleware
    });
});

// Example of a protected route with role-based access control
router.get('/admin-only', authMiddleware, (req, res) => {
    // Check if the authenticated user has the 'admin' role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    res.json({
        message: 'Welcome, Admin! This is an admin-only route.',
        user: req.user
    });
});

module.exports = router;