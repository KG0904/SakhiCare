/**
 * routes/chatbotRoutes.js - Chatbot Routes
 *
 * POST /chatbot  — Send a message and get a mock bot response
 *
 * Protected — JWT required (chatbot is user-specific).
 */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { chat } = require('../controllers/chatbotController');

router.post('/', protect, chat);

module.exports = router;
