import { initializeStoryClient, getWalletClient } from './storyProtocol';
import toast from 'react-hot-toast';

/**
 * Create license terms for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @param {object} terms - License terms configuration
 * @returns {object} - License creation result
 */
export const createLicenseTerms = async (ipAssetId, terms) => {
  const toastId = toast.loading('Creating license terms...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('📜 Creating license terms:', { ipAssetId, terms });
    
    const response = await storyClient.license.attachLicenseTerms({
      ipId: ipAssetId,
      licenseTermsId: terms.licenseTermsId || '1',
      licenseTemplate: terms.template || 'PILicenseTemplate',
    });
    
    toast.success('✅ License terms created successfully!', { id: toastId });
    
    console.log('✅ License terms created:', response);
    
    return {
      success: true,
      licenseId: response.licenseTermsId,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ License creation failed:', error);
    toast.error(`Failed to create license: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get available license options for an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - Available licenses
 */
export const getLicenseOptions = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching license options for:', ipAssetId);
    
    const licenses = await storyClient.license.getLicenseTerms(ipAssetId);
    
    console.log(`✅ Found ${licenses.length} license options`);
    
    return {
      success: true,
      licenses: licenses,
    };
  } catch (error) {
    console.error('❌ Failed to fetch licenses:', error);
    
    return {
      success: false,
      error: error.message,
      licenses: [],
    };
  }
};

/**
 * Mint a license (purchase/acquire)
 * @param {string} ipAssetId - IP Asset ID
 * @param {string} licenseTermsId - License terms ID
 * @param {number} amount - Number of licenses to mint
 * @returns {object} - License mint result
 */
export const purchaseLicense = async (ipAssetId, licenseTermsId, amount = 1) => {
  const toastId = toast.loading(`Purchasing ${amount} license(s)...`);
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    const [receiverAddress] = await walletClient.getAddresses();
    
    console.log('🛒 Purchasing license:', {
      ipAssetId,
      licenseTermsId,
      amount,
      receiver: receiverAddress,
    });
    
    const response = await storyClient.license.mintLicense({
      ipId: ipAssetId,
      licenseTermsId: licenseTermsId,
      amount: amount,
      receiver: receiverAddress,
    });
    
    toast.success(`✅ License(s) purchased successfully!`, { id: toastId });
    
    console.log('✅ License minted:', response);
    
    return {
      success: true,
      licenseId: response.licenseId,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ License purchase failed:', error);
    toast.error(`Purchase failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get owned licenses for a wallet address
 * @param {string} ownerAddress - Wallet address
 * @returns {object} - List of owned licenses
 */
export const getOwnedLicenses = async (ownerAddress) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching licenses for:', ownerAddress);
    
    const licenses = await storyClient.license.getByOwner(ownerAddress);
    
    console.log(`✅ Found ${licenses.length} licenses`);
    
    return {
      success: true,
      licenses: licenses,
      count: licenses.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch owned licenses:', error);
    
    return {
      success: false,
      error: error.message,
      licenses: [],
      count: 0,
    };
  }
};

/**
 * Get license details by license ID
 * @param {string} licenseId - License ID
 * @returns {object} - License details
 */
export const getLicenseDetails = async (licenseId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching license details:', licenseId);
    
    const license = await storyClient.license.get(licenseId);
    
    console.log('✅ License details retrieved:', license);
    
    return {
      success: true,
      license: license,
    };
  } catch (error) {
    console.error('❌ Failed to fetch license details:', error);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Revoke a license
 * @param {string} licenseId - License ID to revoke
 * @returns {object} - Revocation result
 */
export const revokeLicense = async (licenseId) => {
  const toastId = toast.loading('Revoking license...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🚫 Revoking license:', licenseId);
    
    const response = await storyClient.license.revoke({
      licenseId: licenseId,
    });
    
    toast.success('✅ License revoked successfully!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ License revocation failed:', error);
    toast.error(`Revocation failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Transfer license to another address
 * @param {string} licenseId - License ID
 * @param {string} toAddress - Recipient address
 * @returns {object} - Transfer result
 */
export const transferLicense = async (licenseId, toAddress) => {
  const toastId = toast.loading('Transferring license...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔄 Transferring license:', { licenseId, toAddress });
    
    const response = await storyClient.license.transfer({
      licenseId: licenseId,
      to: toAddress,
    });
    
    toast.success('✅ License transferred successfully!', { id: toastId });
    
    return {
      success: true,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ License transfer failed:', error);
    toast.error(`Transfer failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create custom license terms with specific parameters
 * @param {string} ipAssetId - IP Asset ID
 * @param {object} customTerms - Custom license parameters
 * @returns {object} - Creation result
 */
export const createCustomLicense = async (ipAssetId, customTerms) => {
  const toastId = toast.loading('Creating custom license...');
  
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('📜 Creating custom license:', { ipAssetId, customTerms });
    
    const response = await storyClient.license.createLicenseTerms({
      ipId: ipAssetId,
      commercial: customTerms.commercial || false,
      derivatives: customTerms.derivatives || false,
      attribution: customTerms.attribution || true,
      royaltyPercentage: customTerms.royaltyPercentage || 0,
      commercialRevShare: customTerms.commercialRevShare || 0,
    });
    
    toast.success('✅ Custom license created!', { id: toastId });
    
    return {
      success: true,
      licenseTermsId: response.licenseTermsId,
      txHash: response.txHash,
    };
  } catch (error) {
    console.error('❌ Custom license creation failed:', error);
    toast.error(`Failed: ${error.message}`, { id: toastId });
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all licenses associated with an IP Asset
 * @param {string} ipAssetId - IP Asset ID
 * @returns {object} - List of licenses
 */
export const getIPAssetLicenses = async (ipAssetId) => {
  try {
    const walletClient = await getWalletClient();
    const { storyClient } = await initializeStoryClient(walletClient);
    
    console.log('🔍 Fetching all licenses for IP Asset:', ipAssetId);
    
    const licenses = await storyClient.license.getByIPAsset(ipAssetId);
    
    console.log(`✅ Found ${licenses.length} licenses for IP Asset`);
    
    return {
      success: true,
      licenses: licenses,
      count: licenses.length,
    };
  } catch (error) {
    console.error('❌ Failed to fetch IP Asset licenses:', error);
    
    return {
      success: false,
      error: error.message,
      licenses: [],
      count: 0,
    };
  }
};

export default {
  createLicenseTerms,
  getLicenseOptions,
  purchaseLicense,
  getOwnedLicenses,
  getLicenseDetails,
  revokeLicense,
  transferLicense,
  createCustomLicense,
  getIPAssetLicenses,
};
