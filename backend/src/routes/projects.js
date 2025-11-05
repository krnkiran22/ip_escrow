import express from 'express';
import Project from '../models/Project.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/projects
 * Create a new project after blockchain transaction
 */
router.post('/', async (req, res) => {
  try {
    logger.info('📥 Received POST /api/projects request');
    logger.info('Request body keys:', Object.keys(req.body));
    
    const {
      creatorAddress,
      title,
      description,
      category,
      skills,
      files,
      milestones,
      totalBudget,
      revenueSharing,
      licenseType,
      blockchainData,  // { projectId, txHash, blockNumber }
      metadataIpfsHash,
      metadataIpfsUrl
    } = req.body;

    logger.info(`Project data: title="${title}", creator="${creatorAddress}", projectId=${blockchainData?.projectId}`);

    // Validate required fields
    if (!creatorAddress || !title || !description || !blockchainData?.projectId) {
      logger.error('❌ Validation failed:', {
        hasCreator: !!creatorAddress,
        hasTitle: !!title,
        hasDescription: !!description,
        hasProjectId: !!blockchainData?.projectId
      });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: creatorAddress, title, description, blockchainData.projectId'
      });
    }

    // Check if project with this blockchain ID already exists
    const existingProject = await Project.findOne({
      'blockchainData.projectId': blockchainData.projectId
    });

    if (existingProject) {
      return res.status(200).json({
        success: true,
        message: 'Project already exists',
        project: existingProject
      });
    }

    // Create project document
    const project = new Project({
      creatorAddress: creatorAddress.toLowerCase(),
      title,
      description,
      category: category || 'other',
      skills: skills || [],
      // Skip attachments - store in metadata instead
      attachments: [],
      milestoneCount: milestones?.length || 0,
      budget: totalBudget?.toString() || '0',
      status: 'open',
      blockchainData: {
        projectId: blockchainData.projectId,
        txHash: blockchainData.txHash,
        blockNumber: blockchainData.blockNumber,
        deployedAt: new Date()
      },
      metadataUri: metadataIpfsHash,
      metadata: {
        ipfsHash: metadataIpfsHash,
        ipfsUrl: metadataIpfsUrl,
        files: files || [],  // Store files in metadata instead
        milestones: milestones || [],
        revenueSharing: revenueSharing || {},
        licenseType: licenseType || 'standard'
      },
      isPublic: true,
      viewCount: 0,
      applicationCount: 0
    });

    await project.save();

    logger.info(`✅ Project saved to database: ID ${blockchainData.projectId}, MongoDB ID ${project._id}`);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: {
        _id: project._id,
        projectId: blockchainData.projectId,
        title,
        creatorAddress,
        status: 'open'
      }
    });

  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create project'
    });
  }
});

/**
 * GET /api/projects
 * Get all public projects for marketplace
 */
router.get('/', async (req, res) => {
  try {
    const {
      status = 'open',
      category,
      search,
      sort = '-createdAt',
      limit = 50,
      skip = 0
    } = req.query;

    const query = { isPublic: true };

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const projects = await Project.find(query)
      .select('-__v')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Project.countDocuments(query);

    logger.info(`📊 Fetched ${projects.length} projects from database (total: ${total})`);

    res.json({
      success: true,
      projects,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > (parseInt(skip) + parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch projects'
    });
  }
});

/**
 * GET /api/projects/:id
 * Get single project by blockchain ID or MongoDB ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let project;
    
    // Try to find by blockchain project ID first
    if (!isNaN(id)) {
      project = await Project.findOne({ 'blockchainData.projectId': parseInt(id) });
    }
    
    // If not found, try MongoDB ObjectId
    if (!project && id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(id);
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Increment view count
    project.viewCount += 1;
    await project.save();

    res.json({
      success: true,
      project
    });

  } catch (error) {
    logger.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch project'
    });
  }
});

/**
 * GET /api/projects/creator/:address
 * Get projects by creator address
 */
router.get('/creator/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const projects = await Project.find({
      creatorAddress: address.toLowerCase()
    }).sort('-createdAt');

    res.json({
      success: true,
      projects
    });

  } catch (error) {
    logger.error('Error fetching creator projects:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch creator projects'
    });
  }
});

export default router;
