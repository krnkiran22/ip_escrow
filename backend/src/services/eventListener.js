import { ethers } from 'ethers';
import blockchainConfig from '../config/blockchain.js';
import contractService from './contractService.js';
import Project from '../models/Project.js';
import Milestone from '../models/Milestone.js';
import Transaction from '../models/Transaction.js';
import Dispute from '../models/Dispute.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Blockchain Event Listener Service
 * Listens to smart contract events and updates database
 */

class EventListener {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.isListening = false;
    this.lastProcessedBlock = 0;
  }

  /**
   * Initialize event listener
   */
  async initialize() {
    try {
      this.provider = blockchainConfig.getProvider();
      this.contract = contractService.getIPEscrowContract();
      
      // Get last processed block from storage or use current - 100
      const currentBlock = await this.provider.getBlockNumber();
      this.lastProcessedBlock = currentBlock - 100;
      
      logger.info(`✅ Event listener initialized at block ${currentBlock}`);
      return true;
    } catch (error) {
      logger.error('Failed to initialize event listener:', error);
      throw error;
    }
  }

  /**
   * Start listening to events
   */
  async startListening() {
    if (this.isListening) {
      logger.warn('Event listener is already running');
      return;
    }

    this.isListening = true;
    logger.info('🎧 Started listening to blockchain events');

    // Process past events
    await this.processPastEvents();

    // Listen to new events
    this.setupEventListeners();
  }

  /**
   * Stop listening to events
   */
  stopListening() {
    this.isListening = false;
    this.contract.removeAllListeners();
    logger.info('🛑 Stopped listening to blockchain events');
  }

  /**
   * Process past events from last processed block
   */
  async processPastEvents() {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = this.lastProcessedBlock + 1;
      
      if (fromBlock >= currentBlock) {
        logger.info('No past events to process');
        return;
      }

      logger.info(`Processing past events from block ${fromBlock} to ${currentBlock}`);

      // Process in chunks to avoid timeout
      const chunkSize = 1000;
      for (let start = fromBlock; start <= currentBlock; start += chunkSize) {
        const end = Math.min(start + chunkSize - 1, currentBlock);
        
        // Get all events in this range
        const events = await this.contract.queryFilter('*', start, end);
        
        for (const event of events) {
          await this.processEvent(event);
        }
        
        this.lastProcessedBlock = end;
      }

      logger.info(`Processed past events up to block ${currentBlock}`);
    } catch (error) {
      logger.error('Failed to process past events:', error);
    }
  }

  /**
   * Setup real-time event listeners
   */
  setupEventListeners() {
    // ProjectCreated event
    this.contract.on('ProjectCreated', async (projectId, creator, title, totalAmount, event) => {
      await this.handleProjectCreated({
        projectId: Number(projectId),
        creator: creator.toLowerCase(),
        title,
        totalAmount: totalAmount.toString(),
        event
      });
    });

    // CollaboratorApproved event
    this.contract.on('CollaboratorApproved', async (projectId, collaborator, event) => {
      await this.handleCollaboratorApproved({
        projectId: Number(projectId),
        collaborator: collaborator.toLowerCase(),
        event
      });
    });

    // MilestoneSubmitted event
    this.contract.on('MilestoneSubmitted', async (projectId, milestoneIndex, ipfsHash, event) => {
      await this.handleMilestoneSubmitted({
        projectId: Number(projectId),
        milestoneIndex: Number(milestoneIndex),
        ipfsHash,
        event
      });
    });

    // MilestoneApproved event (was incorrectly named MilestoneCompleted)
    this.contract.on('MilestoneApproved', async (projectId, milestoneIndex, amount, event) => {
      await this.handleMilestoneCompleted({
        projectId: Number(projectId),
        milestoneIndex: Number(milestoneIndex),
        amount: amount.toString(),
        event
      });
    });

    // ProjectCancelled event - Not in current ABI, commented out
    // this.contract.on('ProjectCancelled', async (projectId, refundAmount, event) => {
    //   await this.handleProjectCancelled({
    //     projectId: Number(projectId),
    //     refundAmount: refundAmount.toString(),
    //     event
    //   });
    // });

    logger.info('✅ Event listeners setup complete');
  }

  /**
   * Process a single event
   */
  async processEvent(event) {
    try {
      const eventName = event.eventName || event.event;
      
      switch (eventName) {
        case 'ProjectCreated':
          await this.handleProjectCreated({
            projectId: Number(event.args.projectId),
            creator: event.args.creator.toLowerCase(),
            title: event.args.title,
            totalAmount: event.args.totalAmount.toString(),
            event
          });
          break;
          
        case 'CollaboratorApproved':
          await this.handleCollaboratorApproved({
            projectId: Number(event.args.projectId),
            collaborator: event.args.collaborator.toLowerCase(),
            event
          });
          break;
          
        case 'MilestoneSubmitted':
          await this.handleMilestoneSubmitted({
            projectId: Number(event.args.projectId),
            milestoneIndex: Number(event.args.milestoneIndex),
            ipfsHash: event.args.ipfsHash,
            event
          });
          break;
          
        case 'MilestoneCompleted':
          await this.handleMilestoneCompleted({
            projectId: Number(event.args.projectId),
            milestoneIndex: Number(event.args.milestoneIndex),
            amount: event.args.amount.toString(),
            event
          });
          break;
          
        case 'ProjectCancelled':
          await this.handleProjectCancelled({
            projectId: Number(event.args.projectId),
            refundAmount: event.args.refundAmount.toString(),
            event
          });
          break;
      }
    } catch (error) {
      logger.error(`Failed to process event:`, error);
    }
  }

  /**
   * Handle ProjectCreated event
   */
  async handleProjectCreated(data) {
    try {
      logger.info(`📦 ProjectCreated event: ${data.projectId}`);
      
      const receipt = await data.event.getTransactionReceipt();
      const block = await data.event.getBlock();

      // Update project in database
      const project = await Project.findOne({ 
        'blockchainData.projectId': data.projectId 
      });

      if (project) {
        project.contractAddress = data.event.address.toLowerCase();
        project.blockchainData = {
          ...project.blockchainData,
          txHash: receipt.hash.toLowerCase(),
          blockNumber: receipt.blockNumber,
          deployedAt: new Date(block.timestamp * 1000)
        };
        await project.save();
      }

      // Create transaction record
      await Transaction.create({
        project: project._id,
        type: 'project_created',
        amount: data.totalAmount,
        txHash: receipt.hash.toLowerCase(),
        fromAddress: data.creator,
        toAddress: data.event.address.toLowerCase(),
        blockNumber: receipt.blockNumber,
        blockTimestamp: new Date(block.timestamp * 1000),
        gasUsed: receipt.gasUsed.toString(),
        description: `Project "${data.title}" created`
      });

      logger.info(`✅ Project ${data.projectId} synced to database`);
    } catch (error) {
      logger.error('Failed to handle ProjectCreated:', error);
    }
  }

  /**
   * Handle CollaboratorApproved event
   */
  async handleCollaboratorApproved(data) {
    try {
      logger.info(`👥 CollaboratorApproved event: ${data.projectId}`);
      
      const receipt = await data.event.getTransactionReceipt();
      const block = await data.event.getBlock();

      // Find user by wallet
      const collaborator = await User.findOne({ 
        walletAddress: data.collaborator 
      });

      // Update project
      const project = await Project.findOne({ 
        'blockchainData.projectId': data.projectId 
      });

      if (project && collaborator) {
        project.collaborator = collaborator._id;
        project.status = 'in_progress';
        project.startedAt = new Date();
        await project.save();

        // Update application
        const Application = (await import('../models/Application.js')).default;
        await Application.findOneAndUpdate(
          { project: project._id, collaborator: collaborator._id },
          { 
            status: 'approved',
            'blockchainData.txHash': receipt.hash.toLowerCase(),
            'blockchainData.blockNumber': receipt.blockNumber,
            'blockchainData.approvedAt': new Date(block.timestamp * 1000)
          }
        );
      }

      logger.info(`✅ Collaborator approved for project ${data.projectId}`);
    } catch (error) {
      logger.error('Failed to handle CollaboratorApproved:', error);
    }
  }

  /**
   * Handle MilestoneSubmitted event
   */
  async handleMilestoneSubmitted(data) {
    try {
      logger.info(`📝 MilestoneSubmitted event: ${data.projectId}/${data.milestoneIndex}`);
      
      const receipt = await data.event.getTransactionReceipt();

      // Update milestone
      const project = await Project.findOne({ 
        'blockchainData.projectId': data.projectId 
      });

      if (project) {
        await Milestone.findOneAndUpdate(
          { project: project._id, milestoneIndex: data.milestoneIndex },
          { 
            status: 'submitted',
            'deliverable.ipfsHash': data.ipfsHash,
            submittedAt: new Date(),
            'blockchainData.txHash': receipt.hash.toLowerCase(),
            'blockchainData.blockNumber': receipt.blockNumber
          }
        );
      }

      logger.info(`✅ Milestone ${data.projectId}/${data.milestoneIndex} submitted`);
    } catch (error) {
      logger.error('Failed to handle MilestoneSubmitted:', error);
    }
  }

  /**
   * Handle MilestoneCompleted event
   */
  async handleMilestoneCompleted(data) {
    try {
      logger.info(`✅ MilestoneCompleted event: ${data.projectId}/${data.milestoneIndex}`);
      
      const receipt = await data.event.getTransactionReceipt();
      const block = await data.event.getBlock();

      // Update milestone
      const project = await Project.findOne({ 
        'blockchainData.projectId': data.projectId 
      });

      if (project) {
        const milestone = await Milestone.findOneAndUpdate(
          { project: project._id, milestoneIndex: data.milestoneIndex },
          { 
            status: 'approved',
            approvedAt: new Date(),
            'blockchainData.approvedTxHash': receipt.hash.toLowerCase(),
            'blockchainData.approvedBlockNumber': receipt.blockNumber
          },
          { new: true }
        );

        // Update project total paid
        const currentPaid = BigInt(project.totalPaid || '0');
        project.totalPaid = (currentPaid + BigInt(data.amount)).toString();
        await project.save();

        // Create transaction record
        await Transaction.create({
          project: project._id,
          milestone: milestone._id,
          type: 'milestone_paid',
          amount: data.amount,
          txHash: receipt.hash.toLowerCase(),
          fromAddress: project.contractAddress,
          toAddress: project.collaborator.walletAddress,
          blockNumber: receipt.blockNumber,
          blockTimestamp: new Date(block.timestamp * 1000),
          gasUsed: receipt.gasUsed.toString(),
          description: `Milestone ${data.milestoneIndex} payment`
        });
      }

      logger.info(`✅ Milestone ${data.projectId}/${data.milestoneIndex} completed`);
    } catch (error) {
      logger.error('Failed to handle MilestoneCompleted:', error);
    }
  }

  /**
   * Handle ProjectCancelled event
   */
  async handleProjectCancelled(data) {
    try {
      logger.info(`❌ ProjectCancelled event: ${data.projectId}`);
      
      const receipt = await data.event.getTransactionReceipt();
      const block = await data.event.getBlock();

      // Update project
      const project = await Project.findOne({ 
        'blockchainData.projectId': data.projectId 
      });

      if (project) {
        project.status = 'cancelled';
        project.cancelledAt = new Date();
        await project.save();

        // Create refund transaction record
        await Transaction.create({
          project: project._id,
          type: 'refund',
          amount: data.refundAmount,
          txHash: receipt.hash.toLowerCase(),
          fromAddress: project.contractAddress,
          toAddress: project.creator.walletAddress,
          blockNumber: receipt.blockNumber,
          blockTimestamp: new Date(block.timestamp * 1000),
          gasUsed: receipt.gasUsed.toString(),
          description: 'Project cancellation refund'
        });
      }

      logger.info(`✅ Project ${data.projectId} cancelled`);
    } catch (error) {
      logger.error('Failed to handle ProjectCancelled:', error);
    }
  }
}

// Create singleton instance
const eventListener = new EventListener();

export default eventListener;
