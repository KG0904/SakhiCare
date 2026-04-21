/**
 * middleware/errorHandler.js - Global Error Handler
 * 
 * Catches all errors passed via next(error) and
 * returns a consistent JSON error response.
 * In development mode, the stack trace is included.
 */

const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  const statusCode = err.statusCode || 500;

  // Build response object
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Include stack trace only in development for debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Handle specific Mongoose errors for better messages
  // Duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    response.message = 'Duplicate field value entered';
    return res.status(400).json(response);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    response.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json(response);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    response.message = `Resource not found with id: ${err.value}`;
    return res.status(404).json(response);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
