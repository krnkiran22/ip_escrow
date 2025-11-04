import { create } from 'ipfs-http-client';
import axios from 'axios';
import logger from '../utils/logger.js';

/**
 * IPFS Configuration using Pinata
 */
class IPFSConfig {
  constructor() {
    this.client = null;
    this.pinataJWT = process.env.IPFS_JWT;
    this.pinataAPI = 'https://api.pinata.cloud';
    this.gateway = process.env.IPFS_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs';
  }

  /**
   * Initialize IPFS client
   */
  initialize() {
    try {
      if (!this.pinataJWT) {
        logger.warn('⚠️  No IPFS_JWT provided - IPFS functionality limited');
        return false;
      }

      logger.info('✅ IPFS client initialized with Pinata');
      return true;
    } catch (error) {
      logger.error('Failed to initialize IPFS client:', error.message);
      throw error;
    }
  }

  /**
   * Upload JSON to IPFS via Pinata
   */
  async uploadJSON(data, pinataMetadata = {}) {
    try {
      const response = await axios.post(
        `${this.pinataAPI}/pinning/pinJSONToIPFS`,
        {
          pinataContent: data,
          pinataMetadata: {
            name: pinataMetadata.name || 'project-metadata',
            keyvalues: pinataMetadata.keyvalues || {}
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.pinataJWT}`
          }
        }
      );

      logger.info(`📦 JSON uploaded to IPFS: ${response.data.IpfsHash}`);
      return response.data.IpfsHash;
    } catch (error) {
      logger.error('Failed to upload JSON to IPFS:', error.message);
      throw error;
    }
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(fileBuffer, filename, pinataMetadata = {}) {
    try {
      const FormData = (await import('form-data')).default;
      const formData = new FormData();
      
      formData.append('file', fileBuffer, filename);
      
      const metadata = JSON.stringify({
        name: pinataMetadata.name || filename,
        keyvalues: pinataMetadata.keyvalues || {}
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post(
        `${this.pinataAPI}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Authorization': `Bearer ${this.pinataJWT}`
          }
        }
      );

      logger.info(`📄 File uploaded to IPFS: ${response.data.IpfsHash}`);
      return response.data.IpfsHash;
    } catch (error) {
      logger.error('Failed to upload file to IPFS:', error.message);
      throw error;
    }
  }

  /**
   * Get data from IPFS
   */
  async getData(cid) {
    try {
      const url = `${this.gateway}/${cid}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get data from IPFS (${cid}):`, error.message);
      throw error;
    }
  }

  /**
   * Get gateway URL for a CID
   */
  getGatewayURL(cid) {
    return `${this.gateway}/${cid}`;
  }

  /**
   * Pin existing CID
   */
  async pinByCID(cid, pinataMetadata = {}) {
    try {
      const response = await axios.post(
        `${this.pinataAPI}/pinning/pinByHash`,
        {
          hashToPin: cid,
          pinataMetadata: {
            name: pinataMetadata.name || 'pinned-content',
            keyvalues: pinataMetadata.keyvalues || {}
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.pinataJWT}`
          }
        }
      );

      logger.info(`📌 Pinned CID: ${cid}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to pin CID (${cid}):`, error.message);
      throw error;
    }
  }

  /**
   * Unpin content from IPFS
   */
  async unpin(cid) {
    try {
      await axios.delete(
        `${this.pinataAPI}/pinning/unpin/${cid}`,
        {
          headers: {
            'Authorization': `Bearer ${this.pinataJWT}`
          }
        }
      );

      logger.info(`📌 Unpinned CID: ${cid}`);
      return true;
    } catch (error) {
      logger.error(`Failed to unpin CID (${cid}):`, error.message);
      throw error;
    }
  }
}

// Create singleton instance
const ipfsConfig = new IPFSConfig();

export default ipfsConfig;
