import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import User from '../models/User.js';
import { AuthenticationError, AuthorizationError, asyncHandler } from '../utils/errors.js';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AuthenticationError('No authentication token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select('-nonce');

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.isActive) {
      throw new AuthenticationError('User account is deactivated');
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userWallet = user.walletAddress;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }
    throw error;
  }
});

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Verify wallet signature for authentication
 */
export const verifySignature = asyncHandler(async (walletAddress, message, signature) => {
  try {
    // Recover address from signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Check if recovered address matches provided address
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new AuthenticationError('Invalid signature');
    }

    return true;
  } catch (error) {
    throw new AuthenticationError('Signature verification failed');
  }
});

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Check if user has admin role
 */
export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (req.user.role !== 'admin') {
    throw new AuthorizationError('Admin access required');
  }

  next();
});

/**
 * Check if user is project creator
 */
export const requireProjectCreator = (project) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!project.isCreator(req.userId)) {
      throw new AuthorizationError('Only project creator can perform this action');
    }

    next();
  });
};

/**
 * Check if user is project collaborator
 */
export const requireProjectCollaborator = (project) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!project.isCollaborator(req.userId)) {
      throw new AuthorizationError('Only project collaborator can perform this action');
    }

    next();
  });
};

/**
 * Check if user is project creator or collaborator
 */
export const requireProjectMember = (project) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!project.isCreator(req.userId) && !project.isCollaborator(req.userId)) {
      throw new AuthorizationError('Access denied - not a project member');
    }

    next();
  });
};

export default {
  authenticate,
  optionalAuth,
  verifySignature,
  generateToken,
  requireAdmin,
  requireProjectCreator,
  requireProjectCollaborator,
  requireProjectMember,
};
