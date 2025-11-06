import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import Milestone from '../models/Milestone.js';
import Project from '../models/Project.js';

const router = express.Router();

/**
 * @route   GET /api/milestones/project/:projectId
 * @desc    Get all milestones for a project
 * @access  Public (with optional auth for additional details)
 */
router.get('/project/:projectId', asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const milestones = await Milestone.find({ project: projectId })
    .sort({ milestoneIndex: 1 })
    .populate('feedback.from', 'username walletAddress');

  res.json({
    success: true,
    data: milestones,
    total: milestones.length
  });
}));

/**
 * @route   GET /api/milestones/:milestoneId
 * @desc    Get a single milestone
 * @access  Public
 */
router.get('/:milestoneId', asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;

  const milestone = await Milestone.findById(milestoneId)
    .populate('project', 'title creator collaborator creatorAddress')
    .populate('feedback.from', 'username walletAddress');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  res.json({
    success: true,
    data: milestone
  });
}));

/**
 * @route   PUT /api/milestones/:milestoneId/submit
 * @desc    Submit milestone deliverable (step 1: prepare for blockchain)
 * @access  Private (collaborator only)
 */
router.put('/:milestoneId/submit', authenticate, asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { description, ipfsHash, files, ipAssetId } = req.body;

  if (!ipfsHash) {
    return res.status(400).json({
      success: false,
      error: 'IPFS hash is required'
    });
  }

  // Get milestone
  const milestone = await Milestone.findById(milestoneId)
    .populate('project');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  const project = milestone.project;

  // Check if user is the assigned collaborator
  const isCollaborator = (project.collaborator && project.collaborator.toString() === req.userId.toString());

  if (!isCollaborator) {
    return res.status(403).json({
      success: false,
      error: 'Only assigned collaborator can submit milestones'
    });
  }

  // Check milestone status
  if (!['pending', 'in_progress', 'revision_requested', 'rejected'].includes(milestone.status)) {
    return res.status(400).json({
      success: false,
      error: `Cannot submit milestone in ${milestone.status} status`
    });
  }

  // Return data for smart contract call
  res.json({
    success: true,
    message: 'Ready to submit milestone. Call smart contract submitMilestone() next.',
    data: {
      milestoneId: milestone._id,
      projectId: project._id,
      onChainProjectId: project.blockchainData?.projectId,
      milestoneIndex: milestone.milestoneIndex,
      ipfsHash,
      description,
      files: files || [],
      ipAssetId: ipAssetId || null,
      contractFunction: 'submitMilestone',
      contractParams: {
        projectId: project.blockchainData?.projectId,
        index: milestone.milestoneIndex,
        ipfsHash
      }
    }
  });
}));

/**
 * @route   PUT /api/milestones/:milestoneId/confirm-submission
 * @desc    Confirm milestone submission after blockchain transaction
 * @access  Private (collaborator only)
 */
router.put('/:milestoneId/confirm-submission', authenticate, asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { txHash, blockNumber, description, ipfsHash, files, ipAssetId } = req.body;

  if (!txHash || !ipfsHash) {
    return res.status(400).json({
      success: false,
      error: 'Transaction hash and IPFS hash are required'
    });
  }

  // Get milestone
  const milestone = await Milestone.findById(milestoneId)
    .populate('project');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  // Submit deliverable
  await milestone.submitDeliverable({
    description: description || '',
    ipfsHash,
    files: files || []
  });

  // Update blockchain data
  milestone.blockchainData = {
    ...milestone.blockchainData,
    txHash,
    blockNumber: blockNumber || 0
  };

  // Register IP asset if provided
  if (ipAssetId) {
    milestone.ipAssetId = ipAssetId;
    milestone.ipRegisteredAt = new Date();
  }

  await milestone.save();

  res.json({
    success: true,
    message: 'Milestone submitted successfully',
    data: milestone
  });
}));

/**
 * @route   PUT /api/milestones/:milestoneId/approve
 * @desc    Approve milestone (step 1: prepare for blockchain payment release)
 * @access  Private (creator only)
 */
router.put('/:milestoneId/approve', authenticate, asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;

  // Get milestone
  const milestone = await Milestone.findById(milestoneId)
    .populate('project');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  const project = milestone.project;

  // Check if user is the creator
  const isCreator = (project.creator && project.creator.toString() === req.userId.toString()) ||
                    (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase());

  if (!isCreator) {
    return res.status(403).json({
      success: false,
      error: 'Only project creator can approve milestones'
    });
  }

  // Check milestone status
  if (milestone.status !== 'submitted') {
    return res.status(400).json({
      success: false,
      error: 'Milestone must be submitted before approval'
    });
  }

  // Get collaborator details
  const collaboratorUser = await mongoose.model('User').findById(project.collaborator);

  // Return data for smart contract call (which will automatically release payment)
  res.json({
    success: true,
    message: 'Ready to approve milestone and release payment. Call smart contract approveMilestone() next.',
    data: {
      milestoneId: milestone._id,
      projectId: project._id,
      onChainProjectId: project.blockchainData?.projectId,
      milestoneIndex: milestone.milestoneIndex,
      collaboratorAddress: collaboratorUser?.walletAddress,
      paymentAmount: milestone.amount,
      contractFunction: 'approveMilestone',
      contractParams: {
        projectId: project.blockchainData?.projectId,
        index: milestone.milestoneIndex
      },
      note: 'Smart contract will automatically release payment to collaborator upon approval'
    }
  });
}));

/**
 * @route   PUT /api/milestones/:milestoneId/confirm-approval
 * @desc    Confirm milestone approval after blockchain payment release
 * @access  Private (creator only)
 */
router.put('/:milestoneId/confirm-approval', authenticate, asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { txHash, blockNumber } = req.body;

  if (!txHash) {
    return res.status(400).json({
      success: false,
      error: 'Transaction hash is required'
    });
  }

  // Get milestone
  const milestone = await Milestone.findById(milestoneId)
    .populate('project');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  // Approve milestone
  await milestone.approve(txHash, blockNumber);

  const project = milestone.project;

  // Update project totals
  const paidAmount = BigInt(milestone.amount);
  const currentTotal = BigInt(project.totalPaid || '0');
  project.totalPaid = (currentTotal + paidAmount).toString();

  // Check if all milestones are approved
  const allMilestones = await Milestone.find({ project: project._id });
  const allApproved = allMilestones.every(m => m.status === 'approved');

  if (allApproved) {
    project.status = 'completed';
    project.completedAt = new Date();
  } else {
    // Set next milestone to in_progress
    const nextMilestone = allMilestones.find(
      m => m.milestoneIndex === milestone.milestoneIndex + 1 && m.status === 'pending'
    );
    if (nextMilestone) {
      nextMilestone.status = 'in_progress';
      nextMilestone.startedAt = new Date();
      await nextMilestone.save();
    }
  }

  await project.save();

  res.json({
    success: true,
    message: 'Milestone approved and payment released successfully',
    data: {
      milestone,
      project,
      txHash,
      paymentAmount: milestone.amount,
      projectCompleted: allApproved
    }
  });
}));

/**
 * @route   PUT /api/milestones/:milestoneId/reject
 * @desc    Reject milestone
 * @access  Private (creator only)
 */
router.put('/:milestoneId/reject', authenticate, asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Rejection reason must be at least 10 characters'
    });
  }

  // Get milestone
  const milestone = await Milestone.findById(milestoneId)
    .populate('project');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  const project = milestone.project;

  // Check if user is the creator
  const isCreator = (project.creator && project.creator.toString() === req.userId.toString()) ||
                    (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase());

  if (!isCreator) {
    return res.status(403).json({
      success: false,
      error: 'Only project creator can reject milestones'
    });
  }

  // Reject milestone
  await milestone.reject(reason);

  res.json({
    success: true,
    message: 'Milestone rejected',
    data: milestone
  });
}));

/**
 * @route   PUT /api/milestones/:milestoneId/request-revision
 * @desc    Request revision for milestone
 * @access  Private (creator only)
 */
router.put('/:milestoneId/request-revision', authenticate, asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { notes } = req.body;

  if (!notes || notes.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Revision notes must be at least 10 characters'
    });
  }

  // Get milestone
  const milestone = await Milestone.findById(milestoneId)
    .populate('project');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  const project = milestone.project;

  // Check if user is the creator
  const isCreator = (project.creator && project.creator.toString() === req.userId.toString()) ||
                    (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase());

  if (!isCreator) {
    return res.status(403).json({
      success: false,
      error: 'Only project creator can request revisions'
    });
  }

  // Request revision
  await milestone.requestRevision(notes);

  res.json({
    success: true,
    message: 'Revision requested',
    data: milestone
  });
}));

/**
 * @route   POST /api/milestones/:milestoneId/feedback
 * @desc    Add feedback to milestone
 * @access  Private (creator or collaborator)
 */
router.post('/:milestoneId/feedback', authenticate, asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { message } = req.body;

  if (!message || message.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Feedback message must be at least 5 characters'
    });
  }

  // Get milestone
  const milestone = await Milestone.findById(milestoneId)
    .populate('project');

  if (!milestone) {
    return res.status(404).json({
      success: false,
      error: 'Milestone not found'
    });
  }

  const project = milestone.project;

  // Check if user is creator or collaborator
  const isCreator = (project.creator && project.creator.toString() === req.userId.toString()) ||
                    (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase());
  const isCollaborator = project.collaborator && project.collaborator.toString() === req.userId.toString();

  if (!isCreator && !isCollaborator) {
    return res.status(403).json({
      success: false,
      error: 'Only project members can add feedback'
    });
  }

  // Add feedback
  await milestone.addFeedback(req.userId, message);

  await milestone.populate('feedback.from', 'username walletAddress');

  res.json({
    success: true,
    message: 'Feedback added',
    data: milestone
  });
}));

export default router;
