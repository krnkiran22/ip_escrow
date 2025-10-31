import { initializeStoryClient, getWalletClient } from './storyProtocol';
import toast from 'react-hot-toast';

/**
 * Generate attestation for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @param {object} claimData - Claim data to attest
 * @returns {object} - Attestation result
 */
export const generateAttestation = async (ipAssetId, claimData) => {
  const toastId = toast.loading('Generating attestation...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    const [attesterAddress] = await walletClient.getAddresses();
    
    console.log('✍️ Generating attestation:', {
      ipAssetId,
      claimData,
      attester: attesterAddress,
    });
    
    const response = await storyClient.attestation.create({
      ipId: ipAssetId,
      claim: claimData,
      attester: attesterAddress,
    });
    
    toast.success('✅ Attestation generated!', { id: toastId });
    
    console.log('✅ Attestation created:', response);
    
    return {
      success: true,
      attestationId: response.attestationId,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Attestation creation failed:', error);
    toast.error(`Failed to generate attestation: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify attestation validity
 * @param {string} attestationId - Attestation ID
 * @returns {object} - Verification result
 */
export const verifyAttestation = async (attestationId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Verifying attestation:', attestationId);
    
    const isValid = await storyClient.attestation.verify(attestationId);
    
    console.log(`✅ Attestation valid: ${isValid}`);
    
    return {
      success: true,
      isValid: isValid,
      attestationId: attestationId,
    };
  } catch (error) {
    console.error('❌ Attestation verification failed:', error);
    
    return {
      success: false,
      error: error.message,
      isValid: false,
    };
  }
};

/**
 * Get attestation details
 * @param {string} attestationId - Attestation ID
 * @returns {object} - Attestation details
 */
export const getAttestationDetails = async (attestationId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching attestation details:', attestationId);
    
    const attestation = await storyClient.attestation.get(attestationId);
    
    console.log('✅ Attestation details retrieved:', attestation);
    
    return {
      success: true,
      attestation: attestation,
    };
  } catch (error) {
    console.error('❌ Failed to fetch attestation:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all attestations for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - List of attestations
 */
export const getIPAssetAttestations = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching attestations for IP Asset:', ipAssetId);
    
    const attestations = await storyClient.attestation.getByIPAsset(ipAssetId);
    
    console.log(`✅ Found ${attestations.length} attestations`);
    
    return {
      success: true,
      attestations: attestations,
      count: attestations.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch IP Asset attestations:', error);
    
    return {
      success: false,
      error: error.message,
      attestations: [],
      count: 0,
    };
  }
};

/**
 * Get attestations created by an attester
 * @param {string} attesterAddress - Attester's wallet address
 * @returns {object} - List of attestations
 */
export const getAttestationsByAttester = async (attesterAddress) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching attestations by attester:', attesterAddress);
    
    const attestations = await storyClient.attestation.getByAttester(attesterAddress);
    
    console.log(`✅ Found ${attestations.length} attestations`);
    
    return {
      success: true,
      attestations: attestations,
      count: attestations.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch attestations by attester:', error);
    
    return {
      success: false,
      error: error.message,
      attestations: [],
      count: 0,
    };
  }
};

/**
 * Revoke an attestation
 * @param {string} attestationId - Attestation ID
 * @param {string} reason - Revocation reason
 * @returns {object} - Revocation result
 */
export const revokeAttestation = async (attestationId, reason) => {
  const toastId = toast.loading('Revoking attestation...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🚫 Revoking attestation:', { attestationId, reason });
    
    const response = await storyClient.attestation.revoke({
      attestationId: attestationId,
      reason: reason,
    });
    
    toast.success('✅ Attestation revoked!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Attestation revocation failed:', error);
    toast.error(`Revocation failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create ownership attestation for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @param {string} ownerAddress - Owner's address
 * @returns {object} - Attestation result
 */
export const attestOwnership = async (ipAssetId, ownerAddress) => {
  const toastId = toast.loading('Attesting ownership...');
  
  try {
    const claimData = {
      type: 'OWNERSHIP',
      ipAssetId: ipAssetId,
      owner: ownerAddress,
      timestamp: Date.now(),
    };
    
    const result = await generateAttestation(ipAssetId, claimData);
    
    if (result.success) {
      toast.success('✅ Ownership attested!', { id: toastId });
    } else {
      toast.error('Failed to attest ownership', { id: toastId });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Ownership attestation failed:', error);
    toast.error(`Attestation failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create authenticity attestation
 * @param {string} ipAssetId - IP Asset ID
 * @param {object} authenticityData - Authenticity proof data
 * @returns {object} - Attestation result
 */
export const attestAuthenticity = async (ipAssetId, authenticityData) => {
  const toastId = toast.loading('Attesting authenticity...');
  
  try {
    const claimData = {
      type: 'AUTHENTICITY',
      ipAssetId: ipAssetId,
      ...authenticityData,
      timestamp: Date.now(),
    };
    
    const result = await generateAttestation(ipAssetId, claimData);
    
    if (result.success) {
      toast.success('✅ Authenticity attested!', { id: toastId });
    } else {
      toast.error('Failed to attest authenticity', { id: toastId });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Authenticity attestation failed:', error);
    toast.error(`Attestation failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create quality attestation
 * @param {string} ipAssetId - IP Asset ID
 * @param {number} rating - Quality rating (1-5)
 * @param {string} review - Quality review text
 * @returns {object} - Attestation result
 */
export const attestQuality = async (ipAssetId, rating, review) => {
  const toastId = toast.loading('Attesting quality...');
  
  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    const claimData = {
      type: 'QUALITY',
      ipAssetId: ipAssetId,
      rating: rating,
      review: review,
      timestamp: Date.now(),
    };
    
    const result = await generateAttestation(ipAssetId, claimData);
    
    if (result.success) {
      toast.success('✅ Quality attested!', { id: toastId });
    } else {
      toast.error('Failed to attest quality', { id: toastId });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Quality attestation failed:', error);
    toast.error(`Attestation failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create compliance attestation
 * @param {string} ipAssetId - IP Asset ID
 * @param {object} complianceData - Compliance certification data
 * @returns {object} - Attestation result
 */
export const attestCompliance = async (ipAssetId, complianceData) => {
  const toastId = toast.loading('Attesting compliance...');
  
  try {
    const claimData = {
      type: 'COMPLIANCE',
      ipAssetId: ipAssetId,
      ...complianceData,
      timestamp: Date.now(),
    };
    
    const result = await generateAttestation(ipAssetId, claimData);
    
    if (result.success) {
      toast.success('✅ Compliance attested!', { id: toastId });
    } else {
      toast.error('Failed to attest compliance', { id: toastId });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Compliance attestation failed:', error);
    toast.error(`Attestation failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Batch verify multiple attestations
 * @param {array} attestationIds - Array of attestation IDs
 * @returns {object} - Batch verification results
 */
export const batchVerifyAttestations = async (attestationIds) => {
  try {
    console.log('🔍 Batch verifying attestations:', attestationIds);
    
    const results = await Promise.all(
      attestationIds.map(id => verifyAttestation(id))
    );
    
    const validCount = results.filter(r => r.isValid).length;
    
    console.log(`✅ ${validCount}/${attestationIds.length} attestations valid`);
    
    return {
      success: true,
      results: results,
      validCount: validCount,
      totalCount: attestationIds.length,
    };
  } catch (error) {
    console.error('❌ Batch verification failed:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  generateAttestation,
  verifyAttestation,
  getAttestationDetails,
  getIPAssetAttestations,
  getAttestationsByAttester,
  revokeAttestation,
  attestOwnership,
  attestAuthenticity,
  attestQuality,
  attestCompliance,
  batchVerifyAttestations,
};
