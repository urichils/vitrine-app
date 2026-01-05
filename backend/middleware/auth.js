// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Authorization header:', authHeader);
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      return res.status(401).json({ 
        error: 'No authorization header',
        details: 'Please provide Authorization header with Bearer token'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('Invalid authorization format');
      return res.status(401).json({ 
        error: 'Invalid authorization format',
        details: 'Authorization header must start with "Bearer "'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token || token === 'undefined' || token === 'null') {
      console.error('No valid token provided');
      return res.status(401).json({ 
        error: 'No token provided',
        details: 'Token is missing or invalid'
      });
    }

    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'JWT_SECRET not configured'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', { id: decoded.id, username: decoded.username });
    
    req.user = decoded;
    next();
    
  } catch (err) {
    console.error('=== AUTH ERROR ===');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        details: 'Your session has expired. Please log in again.',
        expiredAt: err.expiredAt
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        details: 'The token is malformed or invalid'
      });
    }
    
    return res.status(401).json({ 
      error: 'Authentication failed',
      details: err.message
    });
  }
};

module.exports = auth;