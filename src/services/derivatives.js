import { initializeStoryClient, getWalletClient } from './storyProtocol';
import toast from 'react-hot-toast';

/**
 * Create a derivative IP Asset from a parent IP
 * @param {string} parentIPId - Parent IP Asset ID
 * @param {string} childContentHash - Child content IPFS hash
 * @param {object} metadata - Child IP metadata
 * @returns {object} - Derivative creation result
 */
export const createDerivativeIP = async (parentIPId, childContentHash, metadata) => {
  const toastId = toast.loading('Creating derivative IP Asset...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🌳 Creating derivative IP:', {
      parentIPId,
      childContentHash,
      metadata,
    });
    
    // Register derivative
    const response = await storyClient.ipAsset.registerDerivative({
      parentIpId: parentIPId,
      nftContract: metadata.nftContract || import.meta.env.VITE_IPESCROW_CONTRACT_ADDRESS,
      tokenId: metadata.tokenId || Date.now().toString(),
      metadata: {
        name: metadata.title,
        description: metadata.description,
        contentHash: childContentHash,
        creator: metadata.creator,
      },
    });
    
    toast.success('✅ Derivative IP created successfully!', { id: toastId });
    
    console.log('✅ Derivative IP created:', response);
    
    return {
      success: true,
      ipAssetId: response.ipId,
      txHash: response.txHash,
      parentIPId: parentIPId,
    };
  } catch (error) {
    console.error('❌ Derivative creation failed:', error);
    toast.error(`Failed to create derivative: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get IP genealogy (parent-child relationships)
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - Genealogy tree
 */
export const getIPGenealogy = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching IP genealogy for:', ipAssetId);
    
    // Get parent IPs
    const parents = await storyClient.ipAsset.getParentIps(ipAssetId);
    
    // Get child IPs
    const children = await storyClient.ipAsset.getChildIps(ipAssetId);
    
    console.log(`✅ Found ${parents.length} parents and ${children.length} children`);
    
    return {
      success: true,
      genealogy: {
        current: ipAssetId,
        parents: parents || [],
        children: children || [],
      },
      parentCount: parents.length,
      childCount: children.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch genealogy:', error);
    
    return {
      success: false,
      error: error.message,
      genealogy: {
        current: ipAssetId,
        parents: [],
        children: [],
      },
      parentCount: 0,
      childCount: 0,
    };
  }
};

/**
 * Get full IP genealogy tree (multi-level)
 * @param {string} ipAssetId - IP Asset ID
 * @param {number} depth - Max depth to traverse
 * @returns {object} - Complete genealogy tree
 */
export const getFullGenealogy = async (ipAssetId, depth = 3) => {
  try {
    console.log('🌳 Fetching full genealogy tree:', { ipAssetId, depth });
    
    const tree = await buildGenealogyTree(ipAssetId, depth, 'both');
    
    return {
      success: true,
      tree: tree,
    };
  } catch (error) {
    console.error('❌ Failed to fetch full genealogy:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Helper function to recursively build genealogy tree
 * @param {string} ipAssetId - Current IP Asset ID
 * @param {number} depth - Remaining depth
 * @param {string} direction - 'parents', 'children', or 'both'
 * @returns {object} - Tree node
 */
const buildGenealogyTree = async (ipAssetId, depth, direction = 'both') => {
  if (depth <= 0) {
    return { id: ipAssetId, parents: [], children: [] };
  }
  
  const genealogy = await getIPGenealogy(ipAssetId);
  
  if (!genealogy.success) {
    return { id: ipAssetId, parents: [], children: [] };
  }
  
  const node = {
    id: ipAssetId,
    parents: [],
    children: [],
  };
  
  // Fetch parents recursively
  if (direction === 'parents' || direction === 'both') {
    for (const parentId of genealogy.genealogy.parents) {
      const parentNode = await buildGenealogyTree(parentId, depth - 1, 'parents');
      node.parents.push(parentNode);
    }
  }
  
  // Fetch children recursively
  if (direction === 'children' || direction === 'both') {
    for (const childId of genealogy.genealogy.children) {
      const childNode = await buildGenealogyTree(childId, depth - 1, 'children');
      node.children.push(childNode);
    }
  }
  
  return node;
};

/**
 * Link parent IP to existing child IP
 * @param {string} childIPId - Child IP Asset ID
 * @param {string} parentIPId - Parent IP Asset ID
 * @returns {object} - Link result
 */
export const linkParentIP = async (childIPId, parentIPId) => {
  const toastId = toast.loading('Linking parent IP...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔗 Linking parent IP:', { childIPId, parentIPId });
    
    const response = await storyClient.ipAsset.linkParent({
      childIpId: childIPId,
      parentIpId: parentIPId,
    });
    
    toast.success('✅ Parent IP linked successfully!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Parent linking failed:', error);
    toast.error(`Linking failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if IP is a derivative of another IP
 * @param {string} ipAssetId - IP Asset ID to check
 * @param {string} potentialParentId - Potential parent ID
 * @returns {object} - Check result
 */
export const isDerivativeOf = async (ipAssetId, potentialParentId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Checking derivative relationship:', {
      ipAssetId,
      potentialParentId,
    });
    
    const isDerivative = await storyClient.ipAsset.isDerivative({
      childIpId: ipAssetId,
      parentIpId: potentialParentId,
    });
    
    console.log(`✅ Is derivative: ${isDerivative}`);
    
    return {
      success: true,
      isDerivative: isDerivative,
    };
  } catch (error) {
    console.error('❌ Derivative check failed:', error);
    
    return {
      success: false,
      error: error.message,
      isDerivative: false,
    };
  }
};

/**
 * Get all derivatives of an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - List of derivatives
 */
export const getAllDerivatives = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching all derivatives for:', ipAssetId);
    
    const derivatives = await storyClient.ipAsset.getDescendants(ipAssetId);
    
    console.log(`✅ Found ${derivatives.length} derivatives`);
    
    return {
      success: true,
      derivatives: derivatives,
      count: derivatives.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch derivatives:', error);
    
    return {
      success: false,
      error: error.message,
      derivatives: [],
      count: 0,
    };
  }
};

/**
 * Get all ancestors of an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - List of ancestors
 */
export const getAllAncestors = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching all ancestors for:', ipAssetId);
    
    const ancestors = await storyClient.ipAsset.getAncestors(ipAssetId);
    
    console.log(`✅ Found ${ancestors.length} ancestors`);
    
    return {
      success: true,
      ancestors: ancestors,
      count: ancestors.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch ancestors:', error);
    
    return {
      success: false,
      error: error.message,
      ancestors: [],
      count: 0,
    };
  }
};

/**
 * Calculate derivative depth (generation level)
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - Depth calculation
 */
export const calculateDerivativeDepth = async (ipAssetId) => {
  try {
    console.log('📊 Calculating derivative depth:', ipAssetId);
    
    const ancestors = await getAllAncestors(ipAssetId);
    
    if (!ancestors.success) {
      throw new Error(ancestors.error);
    }
    
    const depth = ancestors.count;
    
    console.log(`✅ Derivative depth: ${depth}`);
    
    return {
      success: true,
      depth: depth,
      isOriginal: depth === 0,
    };
  } catch (error) {
    console.error('❌ Depth calculation failed:', error);
    
    return {
      success: false,
      error: error.message,
      depth: 0,
    };
  }
};

/**
 * Unlink parent IP from child IP
 * @param {string} childIPId - Child IP Asset ID
 * @param {string} parentIPId - Parent IP Asset ID
 * @returns {object} - Unlink result
 */
export const unlinkParentIP = async (childIPId, parentIPId) => {
  const toastId = toast.loading('Unlinking parent IP...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔓 Unlinking parent IP:', { childIPId, parentIPId });
    
    const response = await storyClient.ipAsset.unlinkParent({
      childIpId: childIPId,
      parentIpId: parentIPId,
    });
    
    toast.success('✅ Parent IP unlinked!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Unlinking failed:', error);
    toast.error(`Unlinking failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  createDerivativeIP,
  getIPGenealogy,
  getFullGenealogy,
  linkParentIP,
  isDerivativeOf,
  getAllDerivatives,
  getAllAncestors,
  calculateDerivativeDepth,
  unlinkParentIP,
};
