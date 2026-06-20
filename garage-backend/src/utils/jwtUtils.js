import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token for a user.
 * @param {string} id - The Mongo user identifier.
 * @returns {string} Signed JWT Token.
 */
export const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'your_jwt_secret_key_here', 
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};
