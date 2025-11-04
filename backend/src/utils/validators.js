import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from './errors.js';
import { ethers } from 'ethers';

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new ValidationError(errorMessages);
  }
  next();
};

/**
 * Common validators
 */
export const validators = {
  // Ethereum address validation
  ethereumAddress: (field) => 
    body(field)
      .trim()
      .custom((value) => {
        if (!ethers.isAddress(value)) {
          throw new Error('Invalid Ethereum address');
        }
        return true;
      }),
  
  // MongoDB ObjectId validation
  objectId: (field, location = 'param') => {
    const validator = location === 'param' ? param(field) : body(field);
    return validator.custom((value) => {
      if (!/^[a-f\d]{24}$/i.test(value)) {
        throw new Error('Invalid ID format');
      }
      return true;
    });
  },
  
  // IPFS hash validation
  ipfsHash: (field) =>
    body(field)
      .trim()
      .matches(/^Qm[a-zA-Z0-9]{44}$|^baf[a-zA-Z0-9]+$/)
      .withMessage('Invalid IPFS hash format'),
  
  // Transaction hash validation
  txHash: (field) =>
    body(field)
      .trim()
      .matches(/^0x[a-fA-F0-9]{64}$/)
      .withMessage('Invalid transaction hash format'),
  
  // Pagination
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
  
  // Amount validation (BigInt string)
  amount: (field) =>
    body(field)
      .trim()
      .custom((value) => {
        try {
          const amount = BigInt(value);
          if (amount <= 0n) {
            throw new Error('Amount must be greater than 0');
          }
          return true;
        } catch {
          throw new Error('Invalid amount format');
        }
      }),
  
  // Array validation
  array: (field, minLength = 1) =>
    body(field)
      .isArray({ min: minLength })
      .withMessage(`${field} must be an array with at least ${minLength} item(s)`),
};

/**
 * Route-specific validators
 */

// Auth validators
export const authValidators = {
  connect: [
    validators.ethereumAddress('walletAddress'),
    validate,
  ],
  
  verify: [
    validators.ethereumAddress('walletAddress'),
    body('signature')
      .trim()
      .notEmpty()
      .withMessage('Signature is required'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required'),
    validate,
  ],
  
  updateProfile: [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    validate,
  ],
};

// Project validators
export const projectValidators = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3-200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be 10-5000 characters'),
    body('category')
      .optional()
      .isIn(['development', 'design', 'writing', 'marketing', 'video', 'music', 'other'])
      .withMessage('Invalid category'),
    validators.amount('budget'),
    body('milestones')
      .isArray({ min: 1 })
      .withMessage('At least one milestone is required'),
    validate,
  ],
  
  update: [
    validators.objectId('id', 'param'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3-200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be 10-5000 characters'),
    validate,
  ],
  
  list: [
    ...validators.pagination,
    query('status')
      .optional()
      .isIn(['open', 'in_progress', 'completed', 'cancelled', 'disputed'])
      .withMessage('Invalid status'),
    query('category')
      .optional()
      .isIn(['development', 'design', 'writing', 'marketing', 'video', 'music', 'other'])
      .withMessage('Invalid category'),
    validate,
  ],
};

// Milestone validators
export const milestoneValidators = {
  submit: [
    validators.objectId('id', 'param'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be 10-2000 characters'),
    validators.ipfsHash('ipfsHash'),
    body('registerIP')
      .optional()
      .isBoolean()
      .withMessage('registerIP must be a boolean'),
    validate,
  ],
  
  approve: [
    validators.objectId('id', 'param'),
    body('feedback')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Feedback cannot exceed 1000 characters'),
    validate,
  ],
  
  reject: [
    validators.objectId('id', 'param'),
    body('reason')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Reason must be 10-1000 characters'),
    validate,
  ],
};

// Application validators
export const applicationValidators = {
  apply: [
    validators.objectId('id', 'param'),
    body('proposal')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Proposal must be 50-2000 characters'),
    body('estimatedDuration')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Estimated duration must be at least 1 day'),
    validate,
  ],
  
  review: [
    validators.objectId('id', 'param'),
    body('action')
      .isIn(['approve', 'reject'])
      .withMessage('Action must be either approve or reject'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),
    validate,
  ],
};

// Dispute validators
export const disputeValidators = {
  create: [
    body('projectId')
      .custom((value) => {
        if (!/^[a-f\d]{24}$/i.test(value)) {
          throw new Error('Invalid project ID');
        }
        return true;
      }),
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be 5-200 characters'),
    body('reason')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Reason must be 50-2000 characters'),
    body('category')
      .isIn([
        'quality_issue',
        'missed_deadline',
        'payment_dispute',
        'scope_disagreement',
        'communication_issue',
        'ip_violation',
        'other'
      ])
      .withMessage('Invalid dispute category'),
    validate,
  ],
  
  resolve: [
    validators.objectId('id', 'param'),
    body('decision')
      .isIn(['favor_creator', 'favor_collaborator', 'partial_refund', 'mediation', 'rejected'])
      .withMessage('Invalid decision'),
    body('explanation')
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage('Explanation must be 20-2000 characters'),
    body('refundAmount')
      .optional()
      .custom((value) => {
        try {
          const amount = BigInt(value);
          if (amount < 0n) {
            throw new Error('Refund amount cannot be negative');
          }
          return true;
        } catch {
          throw new Error('Invalid refund amount format');
        }
      }),
    validate,
  ],
};

// IP Asset validators
export const ipAssetValidators = {
  register: [
    body('projectId')
      .custom((value) => {
        if (!/^[a-f\d]{24}$/i.test(value)) {
          throw new Error('Invalid project ID');
        }
        return true;
      }),
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3-200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be 10-2000 characters'),
    body('assetType')
      .isIn(['code', 'design', 'writing', 'video', 'audio', 'image', 'document', 'other'])
      .withMessage('Invalid asset type'),
    validators.ipfsHash('ipfsHash'),
    validate,
  ],
  
  search: [
    query('query')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search query must be 2-100 characters'),
    query('assetType')
      .optional()
      .isIn(['code', 'design', 'writing', 'video', 'audio', 'image', 'document', 'other'])
      .withMessage('Invalid asset type'),
    ...validators.pagination,
    validate,
  ],
};

export default {
  validate,
  validators,
  authValidators,
  projectValidators,
  milestoneValidators,
  applicationValidators,
  disputeValidators,
  ipAssetValidators,
};
