/**
 * Global Error Handling Middleware for Express.
 * Formats Mongoose and JWT errors into clean API responses.
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev environment
  console.error(err);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key (MongoServerError code 11000)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  // JWT Invalid Signature Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Not authorized, token invalid';
    error = new Error(message);
    error.statusCode = 401;
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    const message = 'Not authorized, token expired';
    error = new Error(message);
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
