import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import Application from '../models/Application.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   POST /api/applications/:projectId
 * @desc    Apply to a project
 * @access  Private
 */
router.post('/:projectId', authenticate, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const {
    proposal,
    hourlyRate,
    estimatedDuration,
    coverLetter,
    portfolio,
    attachments
  } = req.body;

  // Validate proposal
  if (!proposal || proposal.length < 50) {
    return res.status(400).json({
      success: false,
      error: 'Proposal must be at least 50 characters'
    });
  }

  // Get project
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }

  // Check if project is open
  if (project.status !== 'open') {
    return res.status(400).json({
      success: false,
      error: 'This project is not accepting applications'
    });
  }

  // Check if user is not the creator
  if (project.creator && project.creator.toString() === req.userId.toString()) {
    return res.status(400).json({
      success: false,
      error: 'You cannot apply to your own project'
    });
  }

  if (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase()) {
    return res.status(400).json({
      success: false,
      error: 'You cannot apply to your own project'
    });
  }

  // Check for existing application
  const existingApplication = await Application.findOne({
    project: projectId,
    collaborator: req.userId
  });

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      error: 'You have already applied to this project'
    });
  }

  // Create application
  const application = new Application({
    project: projectId,
    collaborator: req.userId,
    proposal,
    hourlyRate,
    estimatedDuration,
    coverLetter,
    portfolio: portfolio || [],
    attachments: attachments || []
  });

  await application.save();

  // Increment application count
  project.applicationCount = (project.applicationCount || 0) + 1;
  await project.save();

  // Populate collaborator details
  await application.populate('collaborator', 'username walletAddress reputationScore stats');

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application
  });
}));

/**
 * @route   GET /api/applications/project/:projectId
 * @desc    Get all applications for a project (creator only)
 * @access  Private
 */
router.get('/project/:projectId', authenticate, asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Get project
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }

  // Check if user is the creator
  const isCreator = (project.creator && project.creator.toString() === req.userId.toString()) ||
                    (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase());

  if (!isCreator) {
    return res.status(403).json({
      success: false,
      error: 'Only project creator can view applications'
    });
  }

  // Get applications
  const applications = await Application.find({ project: projectId })
    .populate('collaborator', 'username walletAddress reputationScore stats avatar bio')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: applications,
    total: applications.length
  });
}));

/**
 * @route   GET /api/applications/my
 * @desc    Get current user's applications
 * @access  Private
 */
router.get('/my', authenticate, asyncHandler(async (req, res) => {
  const { status } = req.query;

  const applications = await Application.findByCollaborator(req.userId, status)
    .populate('project creator', 'username walletAddress');

  res.json({
    success: true,
    data: applications,
    total: applications.length
  });
}));

/**
 * @route   PUT /api/applications/:applicationId/approve
 * @desc    Approve an application (step 1: prepare data for blockchain)
 * @access  Private
 */
router.put('/:applicationId/approve', authenticate, asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  // Get application with populated data
  const application = await Application.findById(applicationId)
    .populate('project')
    .populate('collaborator', 'walletAddress username');

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  const project = application.project;

  // Check if user is the creator
  const isCreator = (project.creator && project.creator.toString() === req.userId.toString()) ||
                    (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase());

  if (!isCreator) {
    return res.status(403).json({
      success: false,
      error: 'Only project creator can approve applications'
    });
  }

  // Check if project already has a collaborator
  if (project.collaborator) {
    return res.status(400).json({
      success: false,
      error: 'This project already has an assigned collaborator'
    });
  }

  // Check if application is still pending
  if (application.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: 'This application is no longer pending'
    });
  }

  // Return data for smart contract call
  res.json({
    success: true,
    message: 'Application ready to be approved. Call smart contract approveCollaborator() next.',
    data: {
      applicationId: application._id,
      projectId: project._id,
      onChainProjectId: project.blockchainData?.projectId,
      collaboratorAddress: application.collaborator.walletAddress,
      collaboratorName: application.collaborator.username,
      contractFunction: 'approveCollaborator',
      contractParams: {
        projectId: project.blockchainData?.projectId,
        collaborator: application.collaborator.walletAddress
      }
    }
  });
}));

/**
 * @route   PUT /api/applications/:applicationId/confirm
 * @desc    Confirm application approval after blockchain transaction
 * @access  Private
 */
router.put('/:applicationId/confirm', authenticate, asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { txHash, blockNumber } = req.body;

  if (!txHash) {
    return res.status(400).json({
      success: false,
      error: 'Transaction hash is required'
    });
  }

  // Get application
  const application = await Application.findById(applicationId)
    .populate('project')
    .populate('collaborator');

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  const project = application.project;

  // Approve the application (this will auto-reject others via pre-save hook)
  await application.approve(req.userId, txHash, blockNumber);

  // Update project
  project.collaborator = application.collaborator._id;
  project.status = 'in_progress';
  project.startedAt = new Date();
  await project.save();

  // Populate updated data
  await application.populate('project');
  await application.populate('collaborator', 'username walletAddress reputationScore');

  res.json({
    success: true,
    message: 'Collaborator approved successfully',
    data: {
      application,
      project,
      txHash
    }
  });
}));

/**
 * @route   PUT /api/applications/:applicationId/reject
 * @desc    Reject an application
 * @access  Private
 */
router.put('/:applicationId/reject', authenticate, asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { notes } = req.body;

  // Get application
  const application = await Application.findById(applicationId)
    .populate('project');

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  const project = application.project;

  // Check if user is the creator
  const isCreator = (project.creator && project.creator.toString() === req.userId.toString()) ||
                    (project.creatorAddress && project.creatorAddress.toLowerCase() === req.userWallet.toLowerCase());

  if (!isCreator) {
    return res.status(403).json({
      success: false,
      error: 'Only project creator can reject applications'
    });
  }

  // Reject the application
  await application.reject(req.userId, notes);

  res.json({
    success: true,
    message: 'Application rejected',
    data: application
  });
}));

/**
 * @route   DELETE /api/applications/:applicationId
 * @desc    Withdraw an application
 * @access  Private
 */
router.delete('/:applicationId', authenticate, asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  // Get application
  const application = await Application.findById(applicationId);

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  }

  // Check if user is the applicant
  if (application.collaborator.toString() !== req.userId.toString()) {
    return res.status(403).json({
      success: false,
      error: 'You can only withdraw your own applications'
    });
  }

  // Check if application is still pending
  if (application.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: 'Can only withdraw pending applications'
    });
  }

  // Withdraw the application
  await application.withdraw();

  res.json({
    success: true,
    message: 'Application withdrawn successfully'
  });
}));

export default router;
