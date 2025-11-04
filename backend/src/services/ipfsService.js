import ipfsConfig from '../config/ipfs.js';
import logger from '../utils/logger.js';
import { IPFSError } from '../utils/errors.js';

/**
 * IPFS Service for file and metadata operations
 */

class IPFSService {
  constructor() {
    this.client = null;
    this.gateway = null;
  }

  /**
   * Initialize IPFS service
   */
  async initialize() {
    try {
      await ipfsConfig.initialize();
      this.client = ipfsConfig;
      this.gateway = ipfsConfig.gateway;
      logger.info('✅ IPFS service initialized');
      return true;
    } catch (error) {
      logger.error('Failed to initialize IPFS service:', error);
      throw new IPFSError('IPFS service initialization failed');
    }
  }

  /**
   * Upload project metadata to IPFS
   */
  async uploadProjectMetadata(projectData) {
    try {
      const metadata = {
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        requirements: projectData.requirements || [],
        skills: projectData.skills || [],
        milestones: projectData.milestones.map((m, index) => ({
          index,
          title: m.title,
          description: m.description,
          amount: m.amount
        })),
        creator: projectData.creator,
        budget: projectData.budget,
        deadline: projectData.deadline,
        createdAt: new Date().toISOString()
      };

      const cid = await this.client.uploadJSON(metadata, {
        name: `project-${Date.now()}`,
        keyvalues: {
          type: 'project-metadata',
          title: projectData.title
        }
      });

      logger.info(`📦 Project metadata uploaded: ${cid}`);
      return cid;
    } catch (error) {
      logger.error('Failed to upload project metadata:', error);
      throw new IPFSError('Failed to upload project metadata to IPFS');
    }
  }

  /**
   * Upload milestone deliverable to IPFS
   */
  async uploadMilestoneDeliverable(deliverableData) {
    try {
      const metadata = {
        milestoneIndex: deliverableData.milestoneIndex,
        projectId: deliverableData.projectId,
        description: deliverableData.description,
        files: deliverableData.files || [],
        submittedBy: deliverableData.submittedBy,
        submittedAt: new Date().toISOString()
      };

      const cid = await this.client.uploadJSON(metadata, {
        name: `milestone-${deliverableData.projectId}-${deliverableData.milestoneIndex}`,
        keyvalues: {
          type: 'milestone-deliverable',
          projectId: deliverableData.projectId,
          milestoneIndex: deliverableData.milestoneIndex.toString()
        }
      });

      logger.info(`📄 Milestone deliverable uploaded: ${cid}`);
      return cid;
    } catch (error) {
      logger.error('Failed to upload milestone deliverable:', error);
      throw new IPFSError('Failed to upload deliverable to IPFS');
    }
  }

  /**
   * Upload IP asset metadata to IPFS
   */
  async uploadIPAssetMetadata(assetData) {
    try {
      const metadata = {
        title: assetData.title,
        description: assetData.description,
        assetType: assetData.assetType,
        creator: assetData.creator,
        projectId: assetData.projectId,
        milestoneId: assetData.milestoneId,
        tags: assetData.tags || [],
        licenseTerms: assetData.licenseTerms || {},
        contentHash: assetData.contentHash,
        createdAt: new Date().toISOString()
      };

      const cid = await this.client.uploadJSON(metadata, {
        name: `ip-asset-${Date.now()}`,
        keyvalues: {
          type: 'ip-asset-metadata',
          title: assetData.title,
          assetType: assetData.assetType
        }
      });

      logger.info(`🎨 IP asset metadata uploaded: ${cid}`);
      return cid;
    } catch (error) {
      logger.error('Failed to upload IP asset metadata:', error);
      throw new IPFSError('Failed to upload IP asset metadata to IPFS');
    }
  }

  /**
   * Upload file to IPFS
   */
  async uploadFile(fileBuffer, filename, metadata = {}) {
    try {
      const cid = await this.client.uploadFile(fileBuffer, filename, {
        name: metadata.name || filename,
        keyvalues: metadata.keyvalues || {}
      });

      logger.info(`📁 File uploaded: ${filename} -> ${cid}`);
      return cid;
    } catch (error) {
      logger.error('Failed to upload file:', error);
      throw new IPFSError('Failed to upload file to IPFS');
    }
  }

  /**
   * Get metadata from IPFS
   */
  async getMetadata(cid) {
    try {
      const data = await this.client.getData(cid);
      return data;
    } catch (error) {
      logger.error(`Failed to get metadata from IPFS (${cid}):`, error);
      throw new IPFSError('Failed to retrieve data from IPFS');
    }
  }

  /**
   * Get gateway URL for CID
   */
  getGatewayURL(cid) {
    return this.client.getGatewayURL(cid);
  }

  /**
   * Pin existing content by CID
   */
  async pinContent(cid, metadata = {}) {
    try {
      await this.client.pinByCID(cid, metadata);
      logger.info(`📌 Content pinned: ${cid}`);
      return true;
    } catch (error) {
      logger.error(`Failed to pin content (${cid}):`, error);
      throw new IPFSError('Failed to pin content');
    }
  }

  /**
   * Unpin content from IPFS
   */
  async unpinContent(cid) {
    try {
      await this.client.unpin(cid);
      logger.info(`📌 Content unpinned: ${cid}`);
      return true;
    } catch (error) {
      logger.error(`Failed to unpin content (${cid}):`, error);
      // Don't throw error - unpinning is not critical
      return false;
    }
  }

  /**
   * Validate IPFS hash format
   */
  isValidCID(cid) {
    // CIDv0 or CIDv1
    return /^Qm[a-zA-Z0-9]{44}$|^baf[a-zA-Z0-9]+$/.test(cid);
  }
}

// Create singleton instance
const ipfsService = new IPFSService();

export default ipfsService;
