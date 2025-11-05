import { useState, useEffect } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import contractService from '../services/contractServiceEthers';
import ErrorHandler from '../services/errorHandler';

export function useContract() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (walletClient && publicClient) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          
          await contractService.initialize(provider, signer);
          setInitialized(true);
        } catch (error) {
          ErrorHandler.logError('Contract Service Init', error);
        }
      }
    };

    init();
  }, [walletClient, publicClient]);

  // Factory Methods
  const createProject = async (metadataHash, ipAssetId, milestoneAmounts, totalBudget) => {
    setLoading(true);
    try {
      const result = await contractService.createProject(
        metadataHash,
        ipAssetId,
        milestoneAmounts,
        totalBudget
      );
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProjectsByCreator = async (creator) => {
    try {
      const projects = await contractService.getProjectsByCreator(creator);
      return projects;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    }
  };

  // Project Methods
  const getProjectInfo = async (projectAddress) => {
    try {
      const info = await contractService.getProjectInfo(projectAddress);
      return info;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    }
  };

  const approveCollaborator = async (projectAddress, collaboratorAddress) => {
    setLoading(true);
    try {
      const result = await contractService.approveCollaborator(projectAddress, collaboratorAddress);
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMilestone = async (projectAddress, index) => {
    try {
      const milestone = await contractService.getMilestone(projectAddress, index);
      return milestone;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    }
  };

  const getMilestoneCount = async (projectAddress) => {
    try {
      const count = await contractService.getMilestoneCount(projectAddress);
      return count;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    }
  };

  const submitMilestone = async (projectAddress, milestoneIndex, deliverableHash, deliverableIpAssetId) => {
    setLoading(true);
    try {
      const result = await contractService.submitMilestone(
        projectAddress,
        milestoneIndex,
        deliverableHash,
        deliverableIpAssetId
      );
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveMilestone = async (projectAddress, milestoneIndex) => {
    setLoading(true);
    try {
      const result = await contractService.approveMilestone(projectAddress, milestoneIndex);
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectMilestone = async (projectAddress, milestoneIndex) => {
    setLoading(true);
    try {
      const result = await contractService.rejectMilestone(projectAddress, milestoneIndex);
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const raiseDispute = async (projectAddress, milestoneIndex, disputeMetadataHash) => {
    setLoading(true);
    try {
      const result = await contractService.raiseDispute(projectAddress, milestoneIndex, disputeMetadataHash);
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (projectAddress, milestoneIndex, recipient, amount) => {
    setLoading(true);
    try {
      const result = await contractService.resolveDispute(projectAddress, milestoneIndex, recipient, amount);
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Revenue Vault Methods
  const registerIPAssetRevenue = async (ipAssetId, recipients, shares) => {
    setLoading(true);
    try {
      const result = await contractService.registerIPAssetRevenue(ipAssetId, recipients, shares);
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const distributeRevenue = async (ipAssetId, amount) => {
    setLoading(true);
    try {
      const result = await contractService.distributeRevenue(ipAssetId, amount);
      return result;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRevenueShares = async (ipAssetId) => {
    try {
      const shares = await contractService.getRevenueShares(ipAssetId);
      return shares;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    }
  };

  // Utility Methods
  const getBalance = async (address) => {
    try {
      const balance = await contractService.getBalance(address);
      return balance;
    } catch (error) {
      ErrorHandler.handleTransactionError(error);
      throw error;
    }
  };

  const formatEther = (value) => {
    return contractService.formatEther(value);
  };

  const parseEther = (value) => {
    return contractService.parseEther(value);
  };

  const formatAddress = (address) => {
    return contractService.formatAddress(address);
  };

  return {
    initialized,
    loading,
    
    // Factory
    createProject,
    getProjectsByCreator,
    
    // Project
    getProjectInfo,
    approveCollaborator,
    getMilestone,
    getMilestoneCount,
    submitMilestone,
    approveMilestone,
    rejectMilestone,
    raiseDispute,
    resolveDispute,
    
    // Revenue Vault
    registerIPAssetRevenue,
    distributeRevenue,
    getRevenueShares,
    
    // Utilities
    getBalance,
    formatEther,
    parseEther,
    formatAddress
  };
}

export default useContract;
