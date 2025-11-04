import { ethers } from 'ethers';
import logger from '../utils/logger.js';

/**
 * Initialize Web3 provider for Story Network
 */
class BlockchainConfig {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.chainId = null;
  }

  /**
   * Initialize provider and wallet
   */
  async initialize() {
    try {
      // Create provider
      this.provider = new ethers.JsonRpcProvider(process.env.STORY_RPC_URL);
      
      // Get network info
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);
      
      logger.info(`✅ Connected to Story Network (Chain ID: ${this.chainId})`);

      // Initialize backend wallet for automated transactions
      if (process.env.PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        const balance = await this.provider.getBalance(this.wallet.address);
        logger.info(`📝 Backend wallet: ${this.wallet.address}`);
        logger.info(`💰 Backend wallet balance: ${ethers.formatEther(balance)} IP`);
      } else {
        logger.warn('⚠️  No PRIVATE_KEY provided - automated transactions disabled');
      }

      // Setup event listeners for connection monitoring
      this.provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          logger.info('Network changed, reconnecting...');
          this.initialize();
        }
      });

      return true;
    } catch (error) {
      logger.error('Failed to initialize blockchain connection:', error.message);
      throw error;
    }
  }

  /**
   * Get provider instance
   */
  getProvider() {
    if (!this.provider) {
      throw new Error('Blockchain provider not initialized');
    }
    return this.provider;
  }

  /**
   * Get wallet instance
   */
  getWallet() {
    if (!this.wallet) {
      throw new Error('Backend wallet not initialized');
    }
    return this.wallet;
  }

  /**
   * Get contract instance
   */
  getContract(address, abi) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return new ethers.Contract(address, abi, this.wallet || this.provider);
  }

  /**
   * Check if address is valid
   */
  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  /**
   * Get current block number
   */
  async getCurrentBlock() {
    return await this.provider.getBlockNumber();
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash) {
    return await this.provider.getTransactionReceipt(txHash);
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash, confirmations = 1) {
    return await this.provider.waitForTransaction(txHash, confirmations);
  }
}

// Create singleton instance
const blockchainConfig = new BlockchainConfig();

export default blockchainConfig;
