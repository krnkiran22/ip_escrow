/**
 * Story Protocol Helper Utilities
 * Common formatting, validation, and error handling functions
 */

/**
 * Format wallet address for display
 * @param {string} address - Full wallet address
 * @param {number} startChars - Characters to show at start
 * @param {number} endChars - Characters to show at end
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format transaction hash for display
 * @param {string} txHash - Transaction hash
 * @returns {string} - Formatted hash
 */
export const formatTxHash = (txHash) => {
  return formatAddress(txHash, 8, 6);
};

/**
 * Format IP Asset ID for display
 * @param {string} ipAssetId - IP Asset ID
 * @returns {string} - Formatted ID
 */
export const formatIPAssetId = (ipAssetId) => {
  return formatAddress(ipAssetId, 10, 8);
};

/**
 * Validate Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} - True if valid
 */
export const isValidAddress = (address) => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Validate IPFS hash
 * @param {string} hash - IPFS hash to validate
 * @returns {boolean} - True if valid
 */
export const isValidIPFSHash = (hash) => {
  if (!hash) return false;
  // Check for CIDv0 (Qm...) or CIDv1 (bafy...)
  return /^Qm[a-zA-Z0-9]{44}$/.test(hash) || /^bafy[a-zA-Z0-9]+$/.test(hash);
};

/**
 * Convert percentage to basis points
 * @param {number} percentage - Percentage (0-100)
 * @returns {number} - Basis points
 */
export const percentageToBasisPoints = (percentage) => {
  return Math.floor(percentage * 100);
};

/**
 * Convert basis points to percentage
 * @param {number} basisPoints - Basis points
 * @returns {number} - Percentage
 */
export const basisPointsToPercentage = (basisPoints) => {
  return basisPoints / 100;
};

/**
 * Format token amount for display
 * @param {string|number} amount - Token amount
 * @param {number} decimals - Token decimals
 * @param {number} displayDecimals - Decimals to display
 * @returns {string} - Formatted amount
 */
export const formatTokenAmount = (amount, decimals = 18, displayDecimals = 4) => {
  if (!amount) return '0';
  
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  const divisor = Math.pow(10, decimals);
  const formatted = (value / divisor).toFixed(displayDecimals);
  
  return formatted;
};

/**
 * Parse token amount to wei
 * @param {string|number} amount - Human-readable amount
 * @param {number} decimals - Token decimals
 * @returns {string} - Amount in wei
 */
export const parseTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  const multiplier = Math.pow(10, decimals);
  
  return (value * multiplier).toString();
};

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Formatted date
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Relative time
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = Date.now();
  const diff = now - (timestamp * 1000);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Get Story Protocol explorer URL for transaction
 * @param {string} txHash - Transaction hash
 * @returns {string} - Explorer URL
 */
export const getExplorerTxUrl = (txHash) => {
  const explorerUrl = import.meta.env.VITE_STORY_EXPLORER || 'https://testnet.storyscan.xyz';
  return `${explorerUrl}/tx/${txHash}`;
};

/**
 * Get Story Protocol explorer URL for address
 * @param {string} address - Wallet address
 * @returns {string} - Explorer URL
 */
export const getExplorerAddressUrl = (address) => {
  const explorerUrl = import.meta.env.VITE_STORY_EXPLORER || 'https://testnet.storyscan.xyz';
  return `${explorerUrl}/address/${address}`;
};

/**
 * Get IPFS gateway URL
 * @param {string} hash - IPFS hash
 * @param {string} gateway - IPFS gateway (optional)
 * @returns {string} - Full IPFS URL
 */
export const getIPFSUrl = (hash, gateway = 'https://ipfs.io/ipfs/') => {
  if (!hash) return '';
  
  // Remove ipfs:// prefix if present
  const cleanHash = hash.replace('ipfs://', '');
  
  return `${gateway}${cleanHash}`;
};

/**
 * Parse error message for user display
 * @param {Error|string} error - Error object or message
 * @returns {string} - User-friendly error message
 */
export const parseError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  const message = typeof error === 'string' ? error : error.message;
  
  // Common error patterns
  if (message.includes('user rejected')) {
    return 'Transaction was rejected by user';
  }
  if (message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  if (message.includes('network')) {
    return 'Network error. Please check your connection';
  }
  if (message.includes('gas')) {
    return 'Transaction failed due to gas issues';
  }
  
  return message;
};

/**
 * Validate royalty recipients
 * @param {array} recipients - Array of { address, percentage }
 * @returns {object} - { valid, error }
 */
export const validateRoyaltyRecipients = (recipients) => {
  if (!recipients || recipients.length === 0) {
    return { valid: false, error: 'At least one recipient required' };
  }
  
  // Validate addresses
  for (const recipient of recipients) {
    if (!isValidAddress(recipient.address)) {
      return { valid: false, error: `Invalid address: ${recipient.address}` };
    }
    
    if (recipient.percentage <= 0 || recipient.percentage > 100) {
      return { valid: false, error: 'Percentage must be between 0 and 100' };
    }
  }
  
  // Check total percentage
  const total = recipients.reduce((sum, r) => sum + r.percentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    return { valid: false, error: `Total percentage must equal 100% (currently ${total.toFixed(2)}%)` };
  }
  
  return { valid: true };
};

/**
 * Validate IP metadata
 * @param {object} metadata - IP metadata object
 * @returns {object} - { valid, errors }
 */
export const validateIPMetadata = (metadata) => {
  const errors = [];
  
  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (metadata.title && metadata.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  if (!metadata.description || metadata.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (metadata.description && metadata.description.length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }
  
  if (metadata.creator && !isValidAddress(metadata.creator)) {
    errors.push('Invalid creator address');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Generate unique token ID
 * @param {string} prefix - Optional prefix
 * @returns {string} - Unique token ID
 */
export const generateTokenId = (prefix = '') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}${timestamp}${random}`;
};

/**
 * Sleep function for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise} - Result of function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delay}ms`);
      await sleep(delay);
    }
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Convert file to base64
 * @param {File} file - File object
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Check if metamask is installed
 * @returns {boolean} - True if installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export default {
  formatAddress,
  formatTxHash,
  formatIPAssetId,
  isValidAddress,
  isValidIPFSHash,
  percentageToBasisPoints,
  basisPointsToPercentage,
  formatTokenAmount,
  parseTokenAmount,
  formatTimestamp,
  formatRelativeTime,
  getExplorerTxUrl,
  getExplorerAddressUrl,
  getIPFSUrl,
  parseError,
  validateRoyaltyRecipients,
  validateIPMetadata,
  generateTokenId,
  sleep,
  retryWithBackoff,
  truncateText,
  fileToBase64,
  isMetaMaskInstalled,
  copyToClipboard,
};
