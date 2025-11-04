import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later',
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later',
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many authentication attempts, please try again later',
    });
  },
});

/**
 * Rate limiter for project creation
 */
export const createProjectLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 projects per hour
  skipFailedRequests: true,
  message: 'Too many projects created, please try again later',
  handler: (req, res) => {
    logger.warn(`Project creation rate limit exceeded for user: ${req.userId}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many projects created, please try again in an hour',
    });
  },
});

/**
 * Rate limiter for application submissions
 */
export const applyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 20, // 20 applications per day
  skipFailedRequests: true,
  message: 'Too many applications submitted today',
  handler: (req, res) => {
    logger.warn(`Application rate limit exceeded for user: ${req.userId}`);
    res.status(429).json({
      status: 'error',
      message: 'You have reached the daily application limit',
    });
  },
});

/**
 * Rate limiter for dispute creation
 */
export const disputeLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // 3 disputes per day
  skipFailedRequests: true,
  message: 'Too many disputes filed today',
  handler: (req, res) => {
    logger.warn(`Dispute rate limit exceeded for user: ${req.userId}`);
    res.status(429).json({
      status: 'error',
      message: 'You have reached the daily dispute limit',
    });
  },
});

export default {
  apiLimiter,
  authLimiter,
  createProjectLimiter,
  applyLimiter,
  disputeLimiter,
};
