/**
 * server.js - Application Entry Point
 * 
 * Initializes Express server, connects to MongoDB,
 * registers all middleware and API routes.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express application
const app = express();

// --------------- Global Middleware ---------------

// Enable CORS for cross-origin requests
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --------------- API Routes ---------------

// Health-check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Menstrual Health Tracking API is running',
    version: '1.0.0',
  });
});

// Authentication routes  (signup, login)
app.use('/auth', require('./routes/authRoutes'));

// Cycle tracking routes  (add, history, update)
app.use('/cycle', require('./routes/cycleRoutes'));

// Prediction routes      (next-period, ovulation)
app.use('/prediction', require('./routes/predictionRoutes'));

// Health data routes     (update, get)
app.use('/health', require('./routes/healthRoutes'));

// Chatbot routes         (placeholder)
app.use('/chatbot', require('./routes/chatbotRoutes'));

// --------------- Error Handling ---------------

// Catch-all for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// --------------- Start Server ---------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
