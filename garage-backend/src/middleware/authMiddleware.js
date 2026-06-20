import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes and verify JWT token.
 * Attaches the authenticated user to the req.user object.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Token in Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract Token
      token = req.headers.authorization.split(' ')[1];

      // Verify Token signature and decode expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

      // Fetch user from DB and attach to Request, omit password hash
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized, user not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token verification failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }
};

/**
 * Middleware to authorize specific roles.
 * @param {...string} roles - List of allowed roles.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this route`
      });
    }
    next();
  };
};
