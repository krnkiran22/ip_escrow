import logger from '../utils/logger.js';
import { AppError, formatErrorResponse, handleMongoError } from '../utils/errors.js';

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  logger.error(`Error: ${error.message}`, {
    error: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.userId,
  });

  // Handle MongoDB errors
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000) {
    error = handleMongoError(err);
  }

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError('Resource not found', 404);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Send response
  res.status(error.statusCode || 500).json(formatErrorResponse(error));
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

export { errorHandler, notFound };
