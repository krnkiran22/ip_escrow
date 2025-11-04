import { ethers } from 'ethers';
import blockchainConfig from '../config/blockchain.js';
import logger from '../utils/logger.js';
import { BlockchainError } from '../utils/errors.js';

/**
 * Smart Contract Service for IPEscrow interactions
 */

// IPEscrow Contract ABI (based on your deployed contract)
const IP_ESCROW_ABI = [
  'function createProject(string _title, uint256[] _amounts) external payable returns (uint256)',
  'function approveCollaborator(uint256 _projectId, address _collaborator) external',
  'function submitMilestone(uint256 _projectId, uint256 _milestoneIndex, string _ipfsHash) external',
  'function approveMilestone(uint256 _projectId, uint256 _milestoneIndex) external',
  'function rejectMilestone(uint256 _projectId, uint256 _milestoneIndex, string _reason) external',
  'function cancelProject(uint256 _projectId) external',
  'function getTotalProjects() external view returns (uint256)',
  'function getProject(uint256 _projectId) external view returns (tuple(address creator, address collaborator, string title, uint256[] milestoneAmounts, uint8 status, uint256 totalAmount, uint256 platformFee, bool exists))',
  'function getMilestone(uint256 _projectId, uint256 _milestoneIndex) external view returns (tuple(uint256 amount, string ipfsHash, uint8 status, bool exists))',
  'function platformFeePercentage() external view returns (uint256)',
  'event ProjectCreated(uint256 indexed projectId, address indexed creator, string title, uint256 totalAmount)',
  'event CollaboratorApproved(uint256 indexed projectId, address indexed collaborator)',
  'event MilestoneSubmitted(uint256 indexed projectId, uint256 milestoneIndex, string ipfsHash)',
  'event MilestoneCompleted(uint256 indexed projectId, uint256 milestoneIndex, uint256 amount)',
  'event ProjectCancelled(uint256 indexed projectId, uint256 refundAmount)',
];

class ContractService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contract = null;
  }

  /**
   * Initialize contract service
   */
  async initialize() {
    try {
      this.provider = blockchainConfig.getProvider();
      this.wallet = blockchainConfig.getWallet();
      
      // Initialize contract instance
      this.contract = new ethers.Contract(
        process.env.PROJECT_FACTORY_ADDRESS,
        IP_ESCROW_ABI,
        this.wallet
      );

      logger.info('✅ Contract service initialized');
      return true;
    } catch (error) {
      logger.error('Failed to initialize contract service:', error);
      throw new BlockchainError('Contract service initialization failed');
    }
  }

  /**
   * Get contract instance with signer
   */
  getContractWithSigner(signerAddress) {
    // For read-only operations, use provider
    // For write operations, this would need the user's wallet
    return new ethers.Contract(
      process.env.PROJECT_FACTORY_ADDRESS,
      IP_ESCROW_ABI,
      this.provider
    );
  }

  /**
   * Calculate platform fee
   */
  async calculatePlatformFee(totalAmount) {
    try {
      const feePercentage = await this.contract.platformFeePercentage();
      const fee = (BigInt(totalAmount) * BigInt(feePercentage)) / 100n;
      return fee.toString();
    } catch (error) {
      logger.error('Failed to calculate platform fee:', error);
      // Fallback to 2% if contract call fails
      const fee = (BigInt(totalAmount) * 2n) / 100n;
      return fee.toString();
    }
  }

  /**
   * Get total value required for project creation
   */
  async getTotalValueRequired(milestoneAmounts) {
    const total = milestoneAmounts.reduce((sum, amount) => sum + BigInt(amount), 0n);
    const fee = await this.calculatePlatformFee(total.toString());
    return (total + BigInt(fee)).toString();
  }

  /**
   * Get project details from blockchain
   */
  async getProject(projectId) {
    try {
      const project = await this.contract.getProject(projectId);
      
      return {
        creator: project.creator,
        collaborator: project.collaborator,
        title: project.title,
        milestoneAmounts: project.milestoneAmounts.map(amt => amt.toString()),
        status: Number(project.status),
        totalAmount: project.totalAmount.toString(),
        platformFee: project.platformFee.toString(),
        exists: project.exists
      };
    } catch (error) {
      logger.error(`Failed to get project ${projectId}:`, error);
      throw new BlockchainError(`Failed to fetch project from blockchain`);
    }
  }

  /**
   * Get milestone details from blockchain
   */
  async getMilestone(projectId, milestoneIndex) {
    try {
      const milestone = await this.contract.getMilestone(projectId, milestoneIndex);
      
      return {
        amount: milestone.amount.toString(),
        ipfsHash: milestone.ipfsHash,
        status: Number(milestone.status),
        exists: milestone.exists
      };
    } catch (error) {
      logger.error(`Failed to get milestone ${projectId}/${milestoneIndex}:`, error);
      throw new BlockchainError(`Failed to fetch milestone from blockchain`);
    }
  }

  /**
   * Get total number of projects
   */
  async getTotalProjects() {
    try {
      const total = await this.contract.getTotalProjects();
      return Number(total);
    } catch (error) {
      logger.error('Failed to get total projects:', error);
      throw new BlockchainError('Failed to fetch total projects');
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash, confirmations = 1) {
    try {
      logger.info(`⏳ Waiting for transaction ${txHash}...`);
      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      
      if (receipt.status === 0) {
        throw new BlockchainError('Transaction failed');
      }

      logger.info(`✅ Transaction ${txHash} confirmed`);
      return receipt;
    } catch (error) {
      logger.error(`Transaction ${txHash} failed:`, error);
      throw new BlockchainError('Transaction confirmation failed');
    }
  }

  /**
   * Parse transaction receipt for events
   */
  parseReceipt(receipt) {
    try {
      const events = [];
      
      for (const log of receipt.logs) {
        try {
          const parsed = this.contract.interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          
          if (parsed) {
            events.push({
              name: parsed.name,
              args: parsed.args,
              signature: parsed.signature
            });
          }
        } catch (e) {
          // Skip logs that don't match our ABI
          continue;
        }
      }
      
      return events;
    } catch (error) {
      logger.error('Failed to parse receipt:', error);
      return [];
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      return {
        transaction: tx,
        receipt: receipt,
        events: receipt ? this.parseReceipt(receipt) : []
      };
    } catch (error) {
      logger.error(`Failed to get transaction ${txHash}:`, error);
      throw new BlockchainError('Failed to fetch transaction details');
    }
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(method, args, value = 0n) {
    try {
      const gasEstimate = await this.contract[method].estimateGas(...args, { value });
      // Add 20% buffer
      const gasLimit = (gasEstimate * 120n) / 100n;
      return gasLimit.toString();
    } catch (error) {
      logger.error(`Failed to estimate gas for ${method}:`, error);
      throw new BlockchainError('Gas estimation failed');
    }
  }

  /**
   * Check if address has sufficient balance
   */
  async checkBalance(address, requiredAmount) {
    try {
      const balance = await this.provider.getBalance(address);
      return BigInt(balance) >= BigInt(requiredAmount);
    } catch (error) {
      logger.error(`Failed to check balance for ${address}:`, error);
      return false;
    }
  }

  /**
   * Get current block number
   */
  async getCurrentBlock() {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      logger.error('Failed to get current block:', error);
      throw new BlockchainError('Failed to get current block number');
    }
  }

  /**
   * Get block timestamp
   */
  async getBlockTimestamp(blockNumber) {
    try {
      const block = await this.provider.getBlock(blockNumber);
      return new Date(block.timestamp * 1000);
    } catch (error) {
      logger.error(`Failed to get block ${blockNumber}:`, error);
      return new Date();
    }
  }
}

// Create singleton instance
const contractService = new ContractService();

export default contractService;
