import { initializeStoryClient, getWalletClient } from './storyProtocol';
import toast from 'react-hot-toast';

/**
 * Configure royalty policy for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @param {number} percentage - Royalty percentage (0-100)
 * @param {array} recipients - Array of { address, percentage }
 * @returns {object} - Royalty configuration result
 */
export const configureRoyalty = async (ipAssetId, percentage, recipients) => {
  const toastId = toast.loading('Configuring royalty policy...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('💰 Configuring royalty:', { ipAssetId, percentage, recipients });
    
    // Validate percentages sum to 100
    const totalPercentage = recipients.reduce((sum, r) => sum + r.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Recipient percentages must sum to 100%');
    }
    
    // Configure royalty policy
    const response = await storyClient.royalty.setRoyaltyPolicy({
      ipId: ipAssetId,
      royaltyPolicy: {
        percentage: percentage * 100, // Convert to basis points (1% = 100)
        recipients: recipients.map(r => ({
          account: r.address,
          share: r.percentage * 100, // Convert to basis points
        })),
      },
    });
    
    toast.success('✅ Royalty policy configured!', { id: toastId });
    
    console.log('✅ Royalty configured:', response);
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Royalty configuration failed:', error);
    toast.error(`Failed to configure royalty: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get royalty payment history for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - Royalty history
 */
export const getRoyaltyHistory = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching royalty history for:', ipAssetId);
    
    const history = await storyClient.royalty.getRoyaltyPayments(ipAssetId);
    
    console.log(`✅ Found ${history.length} royalty payments`);
    
    return {
      success: true,
      payments: history,
      count: history.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch royalty history:', error);
    
    return {
      success: false,
      error: error.message,
      payments: [],
      count: 0,
    };
  }
};

/**
 * Claim accumulated royalty payments
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - Claim result with amount
 */
export const claimRoyalty = async (ipAssetId) => {
  const toastId = toast.loading('Claiming royalty payments...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    const [claimerAddress] = await walletClient.getAddresses();
    
    console.log('💸 Claiming royalty for:', { ipAssetId, claimer: claimerAddress });
    
    const response = await storyClient.royalty.claimRevenue({
      ipId: ipAssetId,
      claimer: claimerAddress,
    });
    
    toast.success(`✅ Claimed ${response.claimedAmount} tokens!`, { id: toastId });
    
    console.log('✅ Royalty claimed:', response);
    
    return {
      success: true,
      amount: response.claimedAmount,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Royalty claim failed:', error);
    toast.error(`Claim failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
      amount: '0',
    };
  }
};

/**
 * Get pending royalty amount for an address
 * @param {string} ipAssetId - IP Asset ID
 * @param {string} claimerAddress - Address to check
 * @returns {object} - Pending royalty amount
 */
export const getPendingRoyalty = async (ipAssetId, claimerAddress) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Checking pending royalty:', { ipAssetId, claimerAddress });
    
    const pending = await storyClient.royalty.getPendingRevenue({
      ipId: ipAssetId,
      claimer: claimerAddress,
    });
    
    console.log(`✅ Pending royalty: ${pending}`);
    
    return {
      success: true,
      amount: pending,
    };
  } catch (error) {
    console.error('❌ Failed to get pending royalty:', error);
    
    return {
      success: false,
      error: error.message,
      amount: '0',
    };
  }
};

/**
 * Get royalty policy for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - Royalty policy details
 */
export const getRoyaltyPolicy = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching royalty policy for:', ipAssetId);
    
    const policy = await storyClient.royalty.getRoyaltyPolicy(ipAssetId);
    
    console.log('✅ Royalty policy retrieved:', policy);
    
    return {
      success: true,
      policy: policy,
    };
  } catch (error) {
    console.error('❌ Failed to fetch royalty policy:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update royalty recipients
 * @param {string} ipAssetId - IP Asset ID
 * @param {array} newRecipients - New recipients array
 * @returns {object} - Update result
 */
export const updateRoyaltyRecipients = async (ipAssetId, newRecipients) => {
  const toastId = toast.loading('Updating royalty recipients...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('📝 Updating royalty recipients:', { ipAssetId, newRecipients });
    
    // Validate percentages
    const totalPercentage = newRecipients.reduce((sum, r) => sum + r.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Recipient percentages must sum to 100%');
    }
    
    const response = await storyClient.royalty.updateRecipients({
      ipId: ipAssetId,
      recipients: newRecipients.map(r => ({
        account: r.address,
        share: r.percentage * 100,
      })),
    });
    
    toast.success('✅ Recipients updated!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Recipients update failed:', error);
    toast.error(`Update failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Calculate royalty distribution for a payment amount
 * @param {array} recipients - Recipients with percentages
 * @param {string} totalAmount - Total payment amount
 * @returns {object} - Distribution breakdown
 */
export const calculateRoyaltyDistribution = (recipients, totalAmount) => {
  try {
    const amount = parseFloat(totalAmount);
    
    const distribution = recipients.map(recipient => ({
      address: recipient.address,
      percentage: recipient.percentage,
      amount: (amount * recipient.percentage / 100).toFixed(6),
    }));
    
    return {
      success: true,
      distribution: distribution,
      totalAmount: totalAmount,
    };
  } catch (error) {
    console.error('❌ Distribution calculation failed:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Pay royalty to IP Asset (for derivative usage)
 * @param {string} ipAssetId - IP Asset ID
 * @param {string} amount - Payment amount
 * @returns {object} - Payment result
 */
export const payRoyalty = async (ipAssetId, amount) => {
  const toastId = toast.loading('Processing royalty payment...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('💳 Paying royalty:', { ipAssetId, amount });
    
    const response = await storyClient.royalty.payRoyalty({
      ipId: ipAssetId,
      amount: amount,
    });
    
    toast.success(`✅ Royalty of ${amount} paid!`, { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Royalty payment failed:', error);
    toast.error(`Payment failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get total royalty earned for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - Total earnings
 */
export const getTotalRoyaltyEarned = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching total royalty earned:', ipAssetId);
    
    const total = await storyClient.royalty.getTotalRevenue(ipAssetId);
    
    console.log(`✅ Total royalty earned: ${total}`);
    
    return {
      success: true,
      total: total,
    };
  } catch (error) {
    console.error('❌ Failed to get total earnings:', error);
    
    return {
      success: false,
      error: error.message,
      total: '0',
    };
  }
};

export default {
  configureRoyalty,
  getRoyaltyHistory,
  claimRoyalty,
  getPendingRoyalty,
  getRoyaltyPolicy,
  updateRoyaltyRecipients,
  calculateRoyaltyDistribution,
  payRoyalty,
  getTotalRoyaltyEarned,
};
