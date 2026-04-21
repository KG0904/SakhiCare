/**
 * controllers/authController.js - Authentication Logic (Phase 2)
 *
 * Handles user signup and login.
 * Supports optional age and isAnonymous fields.
 * Passwords are hashed via the User model's pre-save hook.
 * JWTs are issued on successful signup/login.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --------------- Helper ---------------
// Generate a signed JWT that expires in 7 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// --------------- Signup ---------------
// POST /auth/signup
// Creates a new user account and returns a JWT
const signup = async (req, res, next) => {
  try {
    const { name, email, password, age, isAnonymous } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Build user data object
    const userData = { name, email, password };
    if (age !== undefined) userData.age = age;
    if (isAnonymous !== undefined) userData.isAnonymous = isAnonymous;

    // Create user (password is hashed automatically by the pre-save hook)
    const user = await User.create(userData);

    // Respond with user info + token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        isAnonymous: user.isAnonymous,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error); // Forward to global error handler
  }
};

// --------------- Login ---------------
// POST /auth/login
// Authenticates credentials and returns a JWT
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and explicitly include password field for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare entered password with stored hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Respond with user info + token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        isAnonymous: user.isAnonymous,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };
