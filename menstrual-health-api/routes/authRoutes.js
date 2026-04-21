/**
 * routes/authRoutes.js - Authentication Routes
 *
 * POST /auth/signup  — Register a new user
 * POST /auth/login   — Login and receive JWT
 */

const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Public routes (no auth required)
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
