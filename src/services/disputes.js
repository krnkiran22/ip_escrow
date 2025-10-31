import { initializeStoryClient, getWalletClient } from './storyProtocol';
import toast from 'react-hot-toast';

/**
 * File a dispute for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @param {string} reason - Dispute reason
 * @param {string} evidence - IPFS hash of evidence
 * @param {object} details - Additional dispute details
 * @returns {object} - Dispute filing result
 */
export const fileDispute = async (ipAssetId, reason, evidence, details = {}) => {
  const toastId = toast.loading('Filing dispute...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('⚖️ Filing dispute:', {
      ipAssetId,
      reason,
      evidence,
      details,
    });
    
    const response = await storyClient.dispute.raiseDispute({
      ipId: ipAssetId,
      disputeReason: reason,
      evidenceHash: evidence,
      additionalInfo: details,
    });
    
    toast.success('✅ Dispute filed successfully!', { id: toastId });
    
    console.log('✅ Dispute filed:', response);
    
    return {
      success: true,
      disputeId: response.disputeId,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Dispute filing failed:', error);
    toast.error(`Failed to file dispute: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get dispute status and details
 * @param {string} disputeId - Dispute ID
 * @returns {object} - Dispute details
 */
export const getDisputeStatus = async (disputeId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching dispute status:', disputeId);
    
    const dispute = await storyClient.dispute.getDispute(disputeId);
    
    console.log('✅ Dispute details retrieved:', dispute);
    
    return {
      success: true,
      dispute: dispute,
    };
  } catch (error) {
    console.error('❌ Failed to fetch dispute:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all disputes for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - List of disputes
 */
export const getIPAssetDisputes = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching disputes for IP Asset:', ipAssetId);
    
    const disputes = await storyClient.dispute.getByIPAsset(ipAssetId);
    
    console.log(`✅ Found ${disputes.length} disputes`);
    
    return {
      success: true,
      disputes: disputes,
      count: disputes.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch IP Asset disputes:', error);
    
    return {
      success: false,
      error: error.message,
      disputes: [],
      count: 0,
    };
  }
};

/**
 * Submit evidence for an existing dispute
 * @param {string} disputeId - Dispute ID
 * @param {string} evidenceHash - IPFS hash of new evidence
 * @param {string} description - Evidence description
 * @returns {object} - Submission result
 */
export const submitDisputeEvidence = async (disputeId, evidenceHash, description) => {
  const toastId = toast.loading('Submitting evidence...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('📄 Submitting dispute evidence:', {
      disputeId,
      evidenceHash,
      description,
    });
    
    const response = await storyClient.dispute.submitEvidence({
      disputeId: disputeId,
      evidenceHash: evidenceHash,
      description: description,
    });
    
    toast.success('✅ Evidence submitted!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Evidence submission failed:', error);
    toast.error(`Failed to submit evidence: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Resolve a dispute (admin/arbitrator function)
 * @param {string} disputeId - Dispute ID
 * @param {string} resolution - Resolution decision ('approve', 'reject', 'partial')
 * @param {string} details - Resolution details
 * @returns {object} - Resolution result
 */
export const resolveDispute = async (disputeId, resolution, details) => {
  const toastId = toast.loading('Resolving dispute...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('✅ Resolving dispute:', {
      disputeId,
      resolution,
      details,
    });
    
    const response = await storyClient.dispute.resolve({
      disputeId: disputeId,
      resolution: resolution,
      details: details,
    });
    
    toast.success(`✅ Dispute ${resolution}!`, { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
      resolution: resolution,
    };
  } catch (error) {
    console.error('❌ Dispute resolution failed:', error);
    toast.error(`Resolution failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Cancel a dispute (by the disputer)
 * @param {string} disputeId - Dispute ID
 * @returns {object} - Cancellation result
 */
export const cancelDispute = async (disputeId) => {
  const toastId = toast.loading('Canceling dispute...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🚫 Canceling dispute:', disputeId);
    
    const response = await storyClient.dispute.cancel({
      disputeId: disputeId,
    });
    
    toast.success('✅ Dispute canceled!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Dispute cancellation failed:', error);
    toast.error(`Cancellation failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get disputes filed by a specific address
 * @param {string} disputerAddress - Disputer's wallet address
 * @returns {object} - List of disputes
 */
export const getDisputesByAddress = async (disputerAddress) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching disputes by address:', disputerAddress);
    
    const disputes = await storyClient.dispute.getByDisputer(disputerAddress);
    
    console.log(`✅ Found ${disputes.length} disputes`);
    
    return {
      success: true,
      disputes: disputes,
      count: disputes.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch disputes by address:', error);
    
    return {
      success: false,
      error: error.message,
      disputes: [],
      count: 0,
    };
  }
};

/**
 * Appeal a dispute resolution
 * @param {string} disputeId - Dispute ID
 * @param {string} reason - Appeal reason
 * @param {string} evidenceHash - Additional evidence IPFS hash
 * @returns {object} - Appeal result
 */
export const appealDispute = async (disputeId, reason, evidenceHash) => {
  const toastId = toast.loading('Filing appeal...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('📢 Filing dispute appeal:', {
      disputeId,
      reason,
      evidenceHash,
    });
    
    const response = await storyClient.dispute.appeal({
      disputeId: disputeId,
      reason: reason,
      evidenceHash: evidenceHash,
    });
    
    toast.success('✅ Appeal filed!', { id: toastId });
    
    return {
      success: true,
      appealId: response.appealId,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Appeal filing failed:', error);
    toast.error(`Appeal failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Vote on a dispute (for community governance)
 * @param {string} disputeId - Dispute ID
 * @param {boolean} supportDispute - True to support, false to oppose
 * @returns {object} - Vote result
 */
export const voteOnDispute = async (disputeId, supportDispute) => {
  const toastId = toast.loading('Submitting vote...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🗳️ Voting on dispute:', {
      disputeId,
      support: supportDispute,
    });
    
    const response = await storyClient.dispute.vote({
      disputeId: disputeId,
      support: supportDispute,
    });
    
    toast.success('✅ Vote submitted!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Vote submission failed:', error);
    toast.error(`Vote failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get dispute evidence list
 * @param {string} disputeId - Dispute ID
 * @returns {object} - List of evidence
 */
export const getDisputeEvidence = async (disputeId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching dispute evidence:', disputeId);
    
    const evidence = await storyClient.dispute.getEvidence(disputeId);
    
    console.log(`✅ Found ${evidence.length} pieces of evidence`);
    
    return {
      success: true,
      evidence: evidence,
      count: evidence.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch dispute evidence:', error);
    
    return {
      success: false,
      error: error.message,
      evidence: [],
      count: 0,
    };
  }
};

/**
 * Check if an address can file a dispute for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @param {string} disputerAddress - Potential disputer address
 * @returns {object} - Eligibility check result
 */
export const canFileDispute = async (ipAssetId, disputerAddress) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Checking dispute eligibility:', {
      ipAssetId,
      disputerAddress,
    });
    
    const canFile = await storyClient.dispute.canFile({
      ipId: ipAssetId,
      disputer: disputerAddress,
    });
    
    console.log(`✅ Can file dispute: ${canFile}`);
    
    return {
      success: true,
      canFile: canFile,
    };
  } catch (error) {
    console.error('❌ Eligibility check failed:', error);
    
    return {
      success: false,
      error: error.message,
      canFile: false,
    };
  }
};

export default {
  fileDispute,
  getDisputeStatus,
  getIPAssetDisputes,
  submitDisputeEvidence,
  resolveDispute,
  cancelDispute,
  getDisputesByAddress,
  appealDispute,
  voteOnDispute,
  getDisputeEvidence,
  canFileDispute,
};
