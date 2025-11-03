import axios from 'axios';
import CryptoJS from 'crypto-js';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

/**
 * Upload file to IPFS via Pinata
 * @param {File} file - File object from input
 * @returns {object} - { success, ipfsHash, url, size, name }
 */
export async function uploadFile(file) {
  try {
    console.log('📤 Uploading file to IPFS:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Optional metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        size: file.size,
      },
    });
    formData.append('pinataMetadata', metadata);
    
    // Optional pinning options
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
          // Alternative: Use JWT if you prefer
          // 'Authorization': `Bearer ${PINATA_JWT}`,
        },
        maxBodyLength: Infinity,
      }
    );
    
    const ipfsHash = response.data.IpfsHash;
    const url = `${IPFS_GATEWAY}${ipfsHash}`;
    
    console.log('✅ File uploaded to IPFS:', ipfsHash);
    
    return {
      success: true,
      ipfsHash,
      url,
      size: file.size,
      name: file.name,
      type: file.type,
    };
  } catch (error) {
    console.error('❌ IPFS upload failed:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

/**
 * Upload JSON metadata to IPFS
 * @param {object} metadata - JSON object to upload
 * @returns {object} - { success, ipfsHash, url }
 */
export async function uploadJSON(metadata) {
  try {
    console.log('📤 Uploading JSON to IPFS');
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
          // Alternative: Use JWT
          // 'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );
    
    const ipfsHash = response.data.IpfsHash;
    const url = `${IPFS_GATEWAY}${ipfsHash}`;
    
    console.log('✅ JSON uploaded to IPFS:', ipfsHash);
    
    return {
      success: true,
      ipfsHash,
      url,
    };
  } catch (error) {
    console.error('❌ JSON upload failed:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

/**
 * Upload multiple files to IPFS
 * @param {FileList|Array} files - Array of File objects
 * @returns {object} - { success, uploads: [...], failed: [...] }
 */
export async function uploadMultipleFiles(files) {
  try {
    console.log(`📤 Uploading ${files.length} files to IPFS...`);
    
    const uploads = await Promise.all(
      Array.from(files).map(file => uploadFile(file))
    );
    
    const successful = uploads.filter(u => u.success);
    const failed = uploads.filter(u => !u.success);
    
    console.log(`✅ Uploaded ${successful.length}/${files.length} files successfully`);
    
    return {
      success: failed.length === 0,
      uploads: successful,
      failed: failed,
      total: files.length,
      successCount: successful.length,
      failedCount: failed.length,
    };
  } catch (error) {
    console.error('❌ Multiple upload failed:', error);
    return {
      success: false,
      error: error.message,
      uploads: [],
      failed: [],
    };
  }
}

/**
 * Generate SHA-256 hash of file content
 * @param {File} file - File object
 * @returns {Promise<string>} - SHA-256 hash (hex string)
 */
export async function generateFileHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const hash = CryptoJS.SHA256(wordArray).toString();
      console.log('🔐 Generated SHA-256 hash for', file.name);
      resolve(hash);
    };
    
    reader.onerror = (error) => {
      console.error('❌ Hash generation failed:', error);
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Get file URL from IPFS hash
 * @param {string} ipfsHash - IPFS hash
 * @returns {string} - Full URL to access file
 */
export function getFileURL(ipfsHash) {
  // Remove ipfs:// prefix if present
  const hash = ipfsHash.replace('ipfs://', '').replace('ipfs/', '');
  return `${IPFS_GATEWAY}${hash}`;
}

/**
 * Pin existing IPFS hash to ensure permanence
 * @param {string} ipfsHash - IPFS hash to pin
 * @param {string} name - Optional name for the pin
 * @returns {object} - { success, message }
 */
export async function pinFile(ipfsHash, name = '') {
  try {
    console.log('📌 Pinning file:', ipfsHash);
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinByHash',
      {
        hashToPin: ipfsHash,
        pinataMetadata: {
          name: name || ipfsHash,
        },
      },
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
      }
    );
    
    console.log('✅ File pinned successfully');
    
    return {
      success: true,
      message: 'File pinned successfully',
      ipfsHash: response.data.hashToPin,
    };
  } catch (error) {
    console.error('❌ Pinning failed:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} - { valid, error }
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/*', 'application/pdf', 'text/*', 'audio/*', 'video/*'],
  } = options;
  
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
    };
  }
  
  // Check size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
    };
  }
  
  // Check size minimum (avoid empty files)
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }
  
  // Check type
  const fileType = file.type;
  const isAllowed = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return fileType.startsWith(category);
    }
    return fileType === type;
  });
  
  if (!isAllowed) {
    return {
      valid: false,
      error: `File type not allowed: ${fileType || 'unknown'}`,
    };
  }
  
  return {
    valid: true,
  };
}

/**
 * Upload file with progress tracking
 * @param {File} file - File to upload
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {object} - Upload result
 */
export async function uploadFileWithProgress(file, onProgress) {
  try {
    console.log('📤 Uploading with progress tracking:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        },
      }
    );
    
    const ipfsHash = response.data.IpfsHash;
    const url = `${IPFS_GATEWAY}${ipfsHash}`;
    
    console.log('✅ Upload complete:', ipfsHash);
    
    return {
      success: true,
      ipfsHash,
      url,
      size: file.size,
      name: file.name,
    };
  } catch (error) {
    console.error('❌ Upload with progress failed:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

/**
 * Fetch file content from IPFS
 * @param {string} ipfsHash - IPFS hash
 * @returns {Promise<Blob>} - File content as Blob
 */
export async function fetchFileFromIPFS(ipfsHash) {
  try {
    const url = getFileURL(ipfsHash);
    console.log('📥 Fetching file from IPFS:', ipfsHash);
    
    const response = await axios.get(url, {
      responseType: 'blob',
    });
    
    console.log('✅ File fetched successfully');
    
    return {
      success: true,
      blob: response.data,
      contentType: response.headers['content-type'],
    };
  } catch (error) {
    console.error('❌ Fetch failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Fetch JSON content from IPFS
 * @param {string} ipfsHash - IPFS hash
 * @returns {Promise<object>} - Parsed JSON object
 */
export async function fetchJSONFromIPFS(ipfsHash) {
  try {
    const url = getFileURL(ipfsHash);
    console.log('📥 Fetching JSON from IPFS:', ipfsHash);
    
    const response = await axios.get(url);
    
    console.log('✅ JSON fetched successfully');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('❌ JSON fetch failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Check IPFS service status
 * @returns {object} - { configured, gateway, error }
 */
export function checkIPFSConfiguration() {
  const hasApiKey = PINATA_API_KEY && PINATA_API_KEY !== 'your_pinata_api_key_here';
  const hasSecretKey = PINATA_SECRET_KEY && PINATA_SECRET_KEY !== 'your_pinata_secret_key_here';
  const hasJWT = PINATA_JWT && PINATA_JWT !== 'your_pinata_jwt_token_here';
  
  const configured = hasApiKey && hasSecretKey || hasJWT;
  
  return {
    configured,
    hasApiKey,
    hasSecretKey,
    hasJWT,
    gateway: IPFS_GATEWAY,
    error: !configured ? 'IPFS credentials not configured. Please add Pinata API keys to .env file.' : null,
  };
}

/**
 * Test IPFS connection
 * @returns {Promise<object>} - { success, message }
 */
export async function testIPFSConnection() {
  try {
    console.log('🔍 Testing IPFS connection...');
    
    // Check configuration
    const config = checkIPFSConfiguration();
    if (!config.configured) {
      return {
        success: false,
        error: config.error,
      };
    }
    
    // Try to upload a small test file
    const testBlob = new Blob(['Hello from IP Escrow! Test upload.'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const result = await uploadFile(testFile);
    
    if (result.success) {
      console.log('✅ IPFS connection test passed!');
      return {
        success: true,
        message: 'IPFS is configured and working',
        testHash: result.ipfsHash,
        testUrl: result.url,
      };
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error) {
    console.error('❌ IPFS connection test failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  uploadFile,
  uploadJSON,
  uploadMultipleFiles,
  generateFileHash,
  getFileURL,
  pinFile,
  validateFile,
  uploadFileWithProgress,
  fetchFileFromIPFS,
  fetchJSONFromIPFS,
  checkIPFSConfiguration,
  testIPFSConnection,
};
