import { ethers } from 'ethers';
import { CONTRACTS, STORY_AENEID_CONFIG } from '../config/constants';
import { ESCROW_FACTORY_ABI, ESCROW_PROJECT_ABI, REVENUE_VAULT_ABI } from '../config/abis';
import ErrorHandler from './errorHandler';

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.factoryContract = null;
    this.revenueVaultContract = null;
  }

  /**
   * Initialize the contract service with provider and signer
   */
  initialize(provider, signer) {
    this.provider = provider;
    this.signer = signer;

    // Initialize contracts
    this.factoryContract = new ethers.Contract(
      CONTRACTS.FACTORY_ADDRESS,
      ESCROW_FACTORY_ABI,
      signer
    );

    this.revenueVaultContract = new ethers.Contract(
      CONTRACTS.REVENUE_VAULT_ADDRESS,
      REVENUE_VAULT_ABI,
      signer
    );
  }

  /**
   * Get a project contract instance
   */
  getProjectContract(projectAddress) {
    if (!this.signer) {
      throw new Error('Contract service not initialized');
    }

    return new ethers.Contract(projectAddress, ESCROW_PROJECT_ABI, this.signer);
  }

  // ==================== FACTORY CONTRACT METHODS ====================

  /**
   * Create a new project
   */
  async createProject(title, description, milestones, budget, ipfsHash) {
    try {
      if (!this.factoryContract) {
        throw new Error('Factory contract not initialized');
      }

      // Calculate milestone amounts
      const milestoneAmounts = milestones.map(m => ethers.parseEther(m.amount.toString()));
      
      // Calculate total with platform fee
      const totalBudget = milestoneAmounts.reduce((sum, amt) => sum + amt, 0n);
      const platformFee = (totalBudget * BigInt(2)) / BigInt(100); // 2% fee
      const totalValue = totalBudget + platformFee;

      // Create project
      const tx = await this.factoryContract.createProject(
        title,
        milestoneAmounts,
        ipfsHash,
        { value: totalValue }
      );

      const receipt = await tx.wait();

      // Get project ID from event
      const event = receipt.logs.find(
        log => log.topics[0] === ethers.id('ProjectCreated(uint256,address,address,string)')
      );

      let projectId = null;
      let projectAddress = null;

      if (event) {
        const decoded = this.factoryContract.interface.parseLog({
          topics: event.topics,
          data: event.data
        });
        projectId = decoded.args.projectId.toString();
        projectAddress = decoded.args.projectContract;
      }

      return {
        success: true,
        projectId,
        projectAddress,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Create Project', error);
      throw error;
    }
  }

  /**
   * Get projects created by an address
   */
  async getProjectsByCreator(creatorAddress) {
    try {
      if (!this.factoryContract) {
        throw new Error('Factory contract not initialized');
      }

      const projects = await this.factoryContract.getProjectsByCreator(creatorAddress);
      return projects;
    } catch (error) {
      ErrorHandler.logError('Get Projects', error);
      throw error;
    }
  }

  // ==================== PROJECT CONTRACT METHODS ====================

  /**
   * Get project info
   */
  async getProjectInfo(projectAddress) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const info = await contract.getProjectInfo();

      return {
        creator: info.creator,
        collaborator: info.collaborator,
        title: info.title,
        totalBudget: ethers.formatEther(info.totalBudget),
        remainingBudget: ethers.formatEther(info.remainingBudget),
        status: Number(info.status),
        ipfsHash: info.ipfsHash,
        milestoneCount: Number(info.milestoneCount)
      };
    } catch (error) {
      ErrorHandler.logError('Get Project Info', error);
      throw error;
    }
  }

  /**
   * Approve collaborator for project
   */
  async approveCollaborator(projectAddress, collaboratorAddress) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const tx = await contract.approveCollaborator(collaboratorAddress);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Approve Collaborator', error);
      throw error;
    }
  }

  /**
   * Get milestone details
   */
  async getMilestone(projectAddress, milestoneIndex) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const milestone = await contract.getMilestone(milestoneIndex);

      return {
        amount: ethers.formatEther(milestone.amount),
        status: Number(milestone.status),
        ipfsHash: milestone.ipfsHash,
        submittedAt: Number(milestone.submittedAt),
        approvedAt: Number(milestone.approvedAt)
      };
    } catch (error) {
      ErrorHandler.logError('Get Milestone', error);
      throw error;
    }
  }

  /**
   * Submit milestone
   */
  async submitMilestone(projectAddress, milestoneIndex, ipfsHash) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const tx = await contract.submitMilestone(milestoneIndex, ipfsHash);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Submit Milestone', error);
      throw error;
    }
  }

  /**
   * Approve milestone (releases payment)
   */
  async approveMilestone(projectAddress, milestoneIndex) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const tx = await contract.approveMilestone(milestoneIndex);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Approve Milestone', error);
      throw error;
    }
  }

  /**
   * Reject milestone
   */
  async rejectMilestone(projectAddress, milestoneIndex, reason) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const tx = await contract.rejectMilestone(milestoneIndex, reason);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Reject Milestone', error);
      throw error;
    }
  }

  /**
   * Raise a dispute
   */
  async raiseDispute(projectAddress, reason, evidenceHash) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const tx = await contract.raiseDispute(reason, evidenceHash);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Raise Dispute', error);
      throw error;
    }
  }

  /**
   * Resolve a dispute (admin only)
   */
  async resolveDispute(projectAddress, favorCreator) {
    try {
      const contract = this.getProjectContract(projectAddress);
      const tx = await contract.resolveDispute(favorCreator);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Resolve Dispute', error);
      throw error;
    }
  }

  // ==================== REVENUE VAULT METHODS ====================

  /**
   * Register IP asset for revenue sharing
   */
  async registerIPAssetRevenue(ipAssetId, projectAddress, shares) {
    try {
      if (!this.revenueVaultContract) {
        throw new Error('Revenue vault contract not initialized');
      }

      const tx = await this.revenueVaultContract.registerIPAsset(
        ipAssetId,
        projectAddress,
        shares
      );
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Register IP Asset Revenue', error);
      throw error;
    }
  }

  /**
   * Distribute revenue to IP asset holders
   */
  async distributeRevenue(ipAssetId) {
    try {
      if (!this.revenueVaultContract) {
        throw new Error('Revenue vault contract not initialized');
      }

      const tx = await this.revenueVaultContract.distributeRevenue(ipAssetId);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        receipt
      };
    } catch (error) {
      ErrorHandler.logError('Distribute Revenue', error);
      throw error;
    }
  }

  /**
   * Get revenue shares for an IP asset
   */
  async getRevenueShares(ipAssetId) {
    try {
      if (!this.revenueVaultContract) {
        throw new Error('Revenue vault contract not initialized');
      }

      const shares = await this.revenueVaultContract.getRevenueShares(ipAssetId);
      
      return shares.map(share => ({
        recipient: share.recipient,
        percentage: Number(share.percentage),
        totalEarned: ethers.formatEther(share.totalEarned)
      }));
    } catch (error) {
      ErrorHandler.logError('Get Revenue Shares', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get user balance
   */
  async getBalance(address) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      ErrorHandler.logError('Get Balance', error);
      throw error;
    }
  }

  /**
   * Format ether value
   */
  formatEther(value) {
    return ethers.formatEther(value);
  }

  /**
   * Parse ether value
   */
  parseEther(value) {
    return ethers.parseEther(value.toString());
  }

  /**
   * Format address (truncate)
   */
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Get transaction explorer URL
   */
  getExplorerUrl(txHash) {
    return `${STORY_AENEID_CONFIG.explorerUrl}/tx/${txHash}`;
  }

  /**
   * Get address explorer URL
   */
  getAddressExplorerUrl(address) {
    return `${STORY_AENEID_CONFIG.explorerUrl}/address/${address}`;
  }
}

// Export singleton instance
export default new ContractService();
