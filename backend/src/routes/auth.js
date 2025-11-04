import express from 'express';
import User from '../models/User.js';
import { authenticate, verifySignature, generateToken } from '../middleware/auth.js';
import { authValidators } from '../utils/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler, AuthenticationError, ConflictError, NotFoundError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @route   POST /api/auth/connect
 * @desc    Initiate wallet connection (returns nonce for signing)
 * @access  Public
 */
router.post(
  '/connect',
  authLimiter,
  authValidators.connect,
  asyncHandler(async (req, res) => {
    const { walletAddress } = req.body;

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
      });
      logger.info(`New user created: ${walletAddress}`);
    }

    // Generate new nonce
    user.generateNonce();
    await user.save();

    res.json({
      status: 'success',
      data: {
        nonce: user.nonce,
        message: `Sign this message to authenticate with nonce: ${user.nonce}`,
      },
    });
  })
);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify wallet signature and issue JWT token
 * @access  Public
 */
router.post(
  '/verify',
  authLimiter,
  authValidators.verify,
  asyncHandler(async (req, res) => {
    const { walletAddress, signature, message } = req.body;

    // Find user
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      throw new NotFoundError('User not found. Please connect wallet first');
    }

    // Verify signature
    await verifySignature(walletAddress, message, signature);

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    user.generateNonce(); // Generate new nonce for next login
    await user.save();

    logger.info(`User authenticated: ${walletAddress}`);

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          reputationScore: user.reputationScore,
          role: user.role,
        },
      },
    });
  })
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user profile
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId)
      .select('-nonce')
      .populate('projectsAsCreator', 'title status budget')
      .populate('projectsAsCollaborator', 'title status budget');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      status: 'success',
      data: { user },
    });
  })
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  authValidators.updateProfile,
  asyncHandler(async (req, res) => {
    const { username, email, bio, avatar, socialLinks, skills } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if username is taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new ConflictError('Username already taken');
      }
      user.username = username;
    }

    // Update fields
    if (email !== undefined) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;
    if (skills !== undefined) user.skills = skills;

    await user.save();

    logger.info(`Profile updated: ${user.walletAddress}`);

    res.json({
      status: 'success',
      data: { user },
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client should remove token)
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    // Generate new nonce to invalidate old signatures
    const user = await User.findById(req.userId);
    if (user) {
      user.generateNonce();
      await user.save();
    }

    res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  })
);

/**
 * @route   GET /api/auth/user/:address
 * @desc    Get public user profile by wallet address
 * @access  Public
 */
router.get(
  '/user/:address',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ 
      walletAddress: req.params.address.toLowerCase() 
    }).select('-nonce -email');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      status: 'success',
      data: { user },
    });
  })
);

export default router;
