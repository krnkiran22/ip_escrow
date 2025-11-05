import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import blockchainConfig from '../config/blockchain.js';
import logger from '../utils/logger.js';
import { BlockchainError } from '../utils/errors.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load contract ABIs
const IPEscrowABI = JSON.parse(
  readFileSync(join(__dirname, '../contracts/IPEscrow.json'), 'utf8')
).abi;

const RevenueVaultABI = JSON.parse(
  readFileSync(join(__dirname, '../contracts/RevenueVault.json'), 'utf8')
).abi;

/**
 * Smart Contract Service for IPEscrow interactions
 */
class ContractService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.ipEscrowContract = null;
    this.revenueVaultContract = null;
  }

  /**
   * Initialize contract service
   */
  async initialize() {
    try {
      // Validate environment variables
      if (!process.env.IPESCROW_CONTRACT_ADDRESS) {
        throw new Error('IPESCROW_CONTRACT_ADDRESS not configured in .env');
      }
      if (!process.env.REVENUE_VAULT_ADDRESS) {
        throw new Error('REVENUE_VAULT_ADDRESS not configured in .env');
      }

      this.provider = blockchainConfig.getProvider();
      
      // Try to get wallet, but don't fail if not available
      try {
        this.wallet = blockchainConfig.getWallet();
      } catch (error) {
        logger.warn('⚠️  Backend wallet not available - read-only mode');
        this.wallet = null;
      }
      
      // Initialize IPEscrow contract
      this.ipEscrowContract = new ethers.Contract(
        process.env.IPESCROW_CONTRACT_ADDRESS,
        IPEscrowABI,
        this.wallet || this.provider
      );

      // Initialize RevenueVault contract
      this.revenueVaultContract = new ethers.Contract(
        process.env.REVENUE_VAULT_ADDRESS,
        RevenueVaultABI,
        this.wallet || this.provider
      );

      logger.info('✅ Contract service initialized');
      logger.info(`   IPEscrow: ${process.env.IPESCROW_CONTRACT_ADDRESS}`);
      logger.info(`   RevenueVault: ${process.env.REVENUE_VAULT_ADDRESS}`);
      
      return true;
    } catch (error) {
      logger.error('Failed to initialize contract service:', error);
      throw new BlockchainError('Contract service initialization failed');
    }
  }

  /**
   * Get contract instance (read-only)
   */
  getIPEscrowContract() {
    return this.ipEscrowContract;
  }

  /**
   * Get revenue vault contract (read-only)
   */
  getRevenueVaultContract() {
    return this.revenueVaultContract;
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
