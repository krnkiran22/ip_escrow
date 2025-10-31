import { useState, useCallback } from 'react';
import { registerIPAsset, getIPAssetDetails, registerMilestoneIP, getOwnedIPAssets } from '../services/ipRegistration';
import { createLicenseTerms, purchaseLicense, getLicenseOptions } from '../services/licensing';
import { configureRoyalty, claimRoyalty, getPendingRoyalty, getRoyaltyHistory } from '../services/royalty';
import { createDerivativeIP, getIPGenealogy } from '../services/derivatives';
import { fileDispute, getDisputeStatus } from '../services/disputes';
import { generateAttestation, verifyAttestation } from '../services/attestation';
import useStoryProtocol from './useStoryProtocol';

/**
 * React hook for IP Asset operations
 * @returns {object} - IP Asset operations and state
 */
export const useIPAsset = () => {
  const { isInitialized, walletAddress } = useStoryProtocol();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Register a new IP Asset
   */
  const register = useCallback(async (contentHash, metadata) => {
    if (!isInitialized) {
      setError('Story Protocol not initialized');
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await registerIPAsset(contentHash, metadata);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Register milestone IP
   */
  const registerMilestone = useCallback(async (projectId, milestoneIndex, ipfsHash, metadata) => {
    if (!isInitialized) {
      setError('Story Protocol not initialized');
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await registerMilestoneIP(projectId, milestoneIndex, ipfsHash, metadata);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Get IP Asset details
   */
  const getDetails = useCallback(async (ipAssetId) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getIPAssetDetails(ipAssetId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Get owned IP Assets
   */
  const getOwned = useCallback(async (ownerAddress = null) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized', ipAssets: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const address = ownerAddress || walletAddress;
      const result = await getOwnedIPAssets(address);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message, ipAssets: [] };
    } finally {
      setLoading(false);
    }
  }, [isInitialized, walletAddress]);

  /**
   * Create license terms
   */
  const createLicense = useCallback(async (ipAssetId, terms) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createLicenseTerms(ipAssetId, terms);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Purchase a license
   */
  const buyLicense = useCallback(async (ipAssetId, licenseTermsId, amount = 1) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await purchaseLicense(ipAssetId, licenseTermsId, amount);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Get license options
   */
  const getLicenses = useCallback(async (ipAssetId) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized', licenses: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getLicenseOptions(ipAssetId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message, licenses: [] };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Configure royalty
   */
  const setRoyalty = useCallback(async (ipAssetId, percentage, recipients) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await configureRoyalty(ipAssetId, percentage, recipients);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Claim royalty
   */
  const claimRoyalties = useCallback(async (ipAssetId) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await claimRoyalty(ipAssetId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Get pending royalty
   */
  const getPending = useCallback(async (ipAssetId, claimerAddress = null) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized', amount: '0' };
    }

    setLoading(true);
    setError(null);

    try {
      const address = claimerAddress || walletAddress;
      const result = await getPendingRoyalty(ipAssetId, address);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message, amount: '0' };
    } finally {
      setLoading(false);
    }
  }, [isInitialized, walletAddress]);

  /**
   * Get royalty history
   */
  const getRoyaltyPayments = useCallback(async (ipAssetId) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized', payments: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getRoyaltyHistory(ipAssetId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message, payments: [] };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Create derivative IP
   */
  const createDerivative = useCallback(async (parentIPId, childContentHash, metadata) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createDerivativeIP(parentIPId, childContentHash, metadata);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Get IP genealogy
   */
  const getGenealogy = useCallback(async (ipAssetId) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized', genealogy: { current: ipAssetId, parents: [], children: [] } };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getIPGenealogy(ipAssetId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message, genealogy: { current: ipAssetId, parents: [], children: [] } };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * File a dispute
   */
  const dispute = useCallback(async (ipAssetId, reason, evidence, details) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fileDispute(ipAssetId, reason, evidence, details);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Get dispute status
   */
  const getDispute = useCallback(async (disputeId) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getDisputeStatus(disputeId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Generate attestation
   */
  const attest = useCallback(async (ipAssetId, claimData) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateAttestation(ipAssetId, claimData);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Verify attestation
   */
  const verify = useCallback(async (attestationId) => {
    if (!isInitialized) {
      return { success: false, error: 'Not initialized', isValid: false };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyAttestation(attestationId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message, isValid: false };
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  return {
    // State
    loading,
    error,
    isReady: isInitialized,
    
    // IP Registration
    register,
    registerMilestone,
    getDetails,
    getOwned,
    
    // Licensing
    createLicense,
    buyLicense,
    getLicenses,
    
    // Royalty
    setRoyalty,
    claimRoyalties,
    getPending,
    getRoyaltyPayments,
    
    // Derivatives
    createDerivative,
    getGenealogy,
    
    // Disputes
    dispute,
    getDispute,
    
    // Attestation
    attest,
    verify,
  };
};

export default useIPAsset;
