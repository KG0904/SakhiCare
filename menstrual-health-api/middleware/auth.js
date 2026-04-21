/**
 * middleware/auth.js - JWT Authentication Middleware
 * 
 * Protects routes by verifying the JWT token sent
 * in the Authorization header (Bearer <token>).
 * On success, attaches the decoded user payload to req.user.
 */

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }

  try {
    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user id to the request object for downstream use
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid or expired token',
    });
  }
};

module.exports = protect;
