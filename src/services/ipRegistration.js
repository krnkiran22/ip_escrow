import { initializeStoryClient, getWalletClient } from './storyProtocol';
import toast from 'react-hot-toast';

/**
 * Register a new IP Asset on Story Protocol
 * @param {string} contentHash - IPFS hash of the content
 * @param {object} metadata - IP metadata (title, description, creator)
 * @returns {object} - { ipAssetId, txHash, success }
 */
export const registerIPAsset = async (contentHash, metadata) => {
  const toastId = toast.loading('Registering IP Asset on Story Protocol...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('📝 Registering IP Asset:', { contentHash, metadata });
    
    // Register IP Asset
    const response = await storyClient.ipAsset.register({
      nftContract: metadata.nftContract || import.meta.env.VITE_IPESCROW_CONTRACT_ADDRESS,
      tokenId: metadata.tokenId || Date.now().toString(),
      metadata: {
        name: metadata.title,
        description: metadata.description,
        contentHash: contentHash,
        creator: metadata.creator,
      },
    });
    
    toast.success('✅ IP Asset registered successfully!', { id: toastId });
    
    console.log('✅ IP Asset registered:', response);
    
    return {
      ipAssetId: response.ipId,
      txHash: response.txHash,
      success: true,
    };
  } catch (error) {
    console.error('❌ IP Registration failed:', error);
    toast.error(`Failed to register IP: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get IP Asset details from Story Protocol
 * @param {string} ipAssetId - Story Protocol IP Asset ID
 * @returns {object} - IP Asset details
 */
export const getIPAssetDetails = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching IP Asset details:', ipAssetId);
    
    const ipAsset = await storyClient.ipAsset.get(ipAssetId);
    
    console.log('✅ IP Asset details retrieved:', ipAsset);
    
    return {
      success: true,
      data: ipAsset,
    };
  } catch (error) {
    console.error('❌ Failed to fetch IP Asset:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Register IP for a project milestone
 * @param {string} projectId - Project ID
 * @param {string} milestoneIndex - Milestone index
 * @param {string} ipfsHash - IPFS hash of deliverable
 * @param {object} metadata - Additional metadata
 * @returns {object} - Registration result
 */
export const registerMilestoneIP = async (projectId, milestoneIndex, ipfsHash, metadata) => {
  const toastId = toast.loading(`Registering Milestone ${milestoneIndex} IP...`);
  
  try {
    console.log('📝 Registering Milestone IP:', {
      projectId,
      milestoneIndex,
      ipfsHash,
    });
    
    const result = await registerIPAsset(ipfsHash, {
      title: `Project ${projectId} - Milestone ${milestoneIndex}`,
      description: metadata.description || `Milestone ${milestoneIndex} deliverable`,
      creator: metadata.creator,
      projectId: projectId,
      milestoneIndex: milestoneIndex,
      nftContract: metadata.nftContract,
      tokenId: `${projectId}-${milestoneIndex}-${Date.now()}`,
    });
    
    if (result.success) {
      toast.success(`✅ Milestone ${milestoneIndex} IP registered!`, { id: toastId });
    } else {
      toast.error('Failed to register milestone IP', { id: toastId });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Milestone IP registration failed:', error);
    toast.error(`Failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Batch register multiple IP Assets
 * @param {array} ipAssets - Array of { contentHash, metadata }
 * @returns {object} - Batch registration results
 */
export const batchRegisterIPAssets = async (ipAssets) => {
  const toastId = toast.loading(`Registering ${ipAssets.length} IP Assets...`);
  
  try {
    const results = [];
    
    for (let i = 0; i < ipAssets.length; i++) {
      const { contentHash, metadata } = ipAssets[i];
      const result = await registerIPAsset(contentHash, metadata);
      results.push(result);
      
      // Small delay to prevent rate limiting
      if (i < ipAssets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    if (successCount === ipAssets.length) {
      toast.success(`✅ All ${ipAssets.length} IP Assets registered!`, { id: toastId });
    } else {
      toast.warning(`⚠️ ${successCount}/${ipAssets.length} IP Assets registered`, { id: toastId });
    }
    
    return {
      success: successCount > 0,
      results: results,
      successCount: successCount,
      totalCount: ipAssets.length,
    };
  } catch (error) {
    console.error('❌ Batch registration failed:', error);
    toast.error(`Batch registration failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all IP Assets owned by an address
 * @param {string} ownerAddress - Wallet address
 * @returns {object} - List of IP Assets
 */
export const getOwnedIPAssets = async (ownerAddress) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching IP Assets for:', ownerAddress);
    
    const ipAssets = await storyClient.ipAsset.getByOwner(ownerAddress);
    
    console.log(`✅ Found ${ipAssets.length} IP Assets`);
    
    return {
      success: true,
      ipAssets: ipAssets,
      count: ipAssets.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch owned IP Assets:', error);
    
    return {
      success: false,
      error: error.message,
      ipAssets: [],
      count: 0,
    };
  }
};

/**
 * Transfer IP Asset ownership
 * @param {string} ipAssetId - IP Asset ID
 * @param {string} toAddress - Recipient address
 * @returns {object} - Transfer result
 */
export const transferIPAsset = async (ipAssetId, toAddress) => {
  const toastId = toast.loading('Transferring IP Asset...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔄 Transferring IP Asset:', { ipAssetId, toAddress });
    
    const response = await storyClient.ipAsset.transfer({
      ipId: ipAssetId,
      to: toAddress,
    });
    
    toast.success('✅ IP Asset transferred successfully!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ IP Asset transfer failed:', error);
    toast.error(`Transfer failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update IP Asset metadata
 * @param {string} ipAssetId - IP Asset ID
 * @param {object} newMetadata - Updated metadata
 * @returns {object} - Update result
 */
export const updateIPAssetMetadata = async (ipAssetId, newMetadata) => {
  const toastId = toast.loading('Updating IP Asset metadata...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('📝 Updating IP Asset metadata:', { ipAssetId, newMetadata });
    
    const response = await storyClient.ipAsset.updateMetadata({
      ipId: ipAssetId,
      metadata: newMetadata,
    });
    
    toast.success('✅ IP Asset metadata updated!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Metadata update failed:', error);
    toast.error(`Update failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  registerIPAsset,
  getIPAssetDetails,
  registerMilestoneIP,
  batchRegisterIPAssets,
  getOwnedIPAssets,
  transferIPAsset,
  updateIPAssetMetadata,
};
