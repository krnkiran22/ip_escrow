import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { STORY_AENEID_CONFIG } from '../config/constants';
import ErrorHandler from './errorHandler';

class StoryProtocolService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  async initialize(account) {
    try {
      const config = {
        transport: http(STORY_AENEID_CONFIG.rpcUrl),
        chainId: STORY_AENEID_CONFIG.chainId,
        account
      };

      this.client = StoryClient.newClient(config);
      this.initialized = true;
      console.log('Story Protocol SDK initialized');
    } catch (error) {
      ErrorHandler.logError('Story Protocol Init', error);
      throw new Error('Failed to initialize Story Protocol SDK');
    }
  }

  async registerIPAsset(metadata) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      console.log('Registering IP Asset on Story Protocol...', metadata);

      const response = await this.client.ipAsset.register({
        nftContract: metadata.nftContract,
        tokenId: metadata.tokenId,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          ipMetadata: {
            ipMetadataURI: metadata.ipfsHash,
            ipMetadataHash: metadata.hash,
            nftMetadataURI: metadata.nftMetadataURI,
            nftMetadataHash: metadata.nftMetadataHash
          }
        }
      });

      console.log('IP Asset registered:', response);

      return {
        success: true,
        ipAssetId: response.ipId,
        txHash: response.txHash
      };
    } catch (error) {
      ErrorHandler.logError('Register IP Asset', error);
      throw new Error('Failed to register IP asset: ' + error.message);
    }
  }

  async registerDerivative(parentIpId, childMetadata) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      console.log('Registering derivative IP Asset...', { parentIpId, childMetadata });

      const response = await this.client.ipAsset.registerDerivative({
        childIpId: childMetadata.childIpId,
        parentIpIds: [parentIpId],
        licenseTermsIds: childMetadata.licenseTermsIds || []
      });

      console.log('Derivative registered:', response);

      return {
        success: true,
        ipAssetId: response.ipId,
        txHash: response.txHash
      };
    } catch (error) {
      ErrorHandler.logError('Register Derivative', error);
      throw new Error('Failed to register derivative: ' + error.message);
    }
  }

  async getIPAsset(ipAssetId) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      const ipAsset = await this.client.ipAsset.get(ipAssetId);
      return {
        success: true,
        data: ipAsset
      };
    } catch (error) {
      ErrorHandler.logError('Get IP Asset', error);
      throw new Error('Failed to get IP asset: ' + error.message);
    }
  }

  async getIPAssetsByOwner(ownerAddress) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      const assets = await this.client.ipAsset.searchByOwner(ownerAddress);
      return {
        success: true,
        data: assets
      };
    } catch (error) {
      ErrorHandler.logError('Get IP Assets By Owner', error);
      throw new Error('Failed to get IP assets: ' + error.message);
    }
  }

  async attachLicenseTerms(ipAssetId, licenseTerms) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      console.log('Attaching license terms...', { ipAssetId, licenseTerms });

      const response = await this.client.license.attachLicenseTerms({
        ipId: ipAssetId,
        licenseTermsId: licenseTerms.id
      });

      console.log('License terms attached:', response);

      return {
        success: true,
        txHash: response.txHash
      };
    } catch (error) {
      ErrorHandler.logError('Attach License Terms', error);
      throw new Error('Failed to attach license terms: ' + error.message);
    }
  }

  async mintLicenseTokens(ipAssetId, amount, recipient) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      console.log('Minting license tokens...', { ipAssetId, amount, recipient });

      const response = await this.client.license.mintLicenseTokens({
        licensorIpId: ipAssetId,
        amount,
        receiver: recipient
      });

      console.log('License tokens minted:', response);

      return {
        success: true,
        licenseTokenIds: response.licenseTokenIds,
        txHash: response.txHash
      };
    } catch (error) {
      ErrorHandler.logError('Mint License Tokens', error);
      throw new Error('Failed to mint license tokens: ' + error.message);
    }
  }

  async fileDispute(ipAssetId, disputeMetadata) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      console.log('Filing dispute on Story Protocol...', { ipAssetId, disputeMetadata });

      const response = await this.client.dispute.raise({
        targetIpId: ipAssetId,
        disputeEvidenceHash: disputeMetadata.evidenceHash,
        targetTag: disputeMetadata.targetTag || 'INFRINGEMENT',
        data: disputeMetadata.data
      });

      console.log('Dispute filed:', response);

      return {
        success: true,
        disputeId: response.disputeId,
        txHash: response.txHash
      };
    } catch (error) {
      ErrorHandler.logError('File Dispute', error);
      throw new Error('Failed to file dispute: ' + error.message);
    }
  }

  async resolveDispute(disputeId, resolution) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      console.log('Resolving dispute...', { disputeId, resolution });

      const response = await this.client.dispute.resolve({
        disputeId,
        data: resolution.data
      });

      console.log('Dispute resolved:', response);

      return {
        success: true,
        txHash: response.txHash
      };
    } catch (error) {
      ErrorHandler.logError('Resolve Dispute', error);
      throw new Error('Failed to resolve dispute: ' + error.message);
    }
  }

  async getIPGenealogy(ipAssetId) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      // Get parent IP assets
      const parents = await this.client.ipAsset.getAncestors(ipAssetId);
      
      // Get child IP assets
      const children = await this.client.ipAsset.getDescendants(ipAssetId);

      return {
        success: true,
        parents,
        children
      };
    } catch (error) {
      ErrorHandler.logError('Get IP Genealogy', error);
      throw new Error('Failed to get IP genealogy: ' + error.message);
    }
  }

  async getRoyalties(ipAssetId) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      const royalties = await this.client.royalty.getRoyalty(ipAssetId);

      return {
        success: true,
        data: royalties
      };
    } catch (error) {
      ErrorHandler.logError('Get Royalties', error);
      throw new Error('Failed to get royalties: ' + error.message);
    }
  }

  async claimRoyalties(ipAssetId) {
    try {
      if (!this.initialized) {
        throw new Error('Story Protocol not initialized');
      }

      console.log('Claiming royalties...', ipAssetId);

      const response = await this.client.royalty.claimRevenue({
        ipId: ipAssetId
      });

      console.log('Royalties claimed:', response);

      return {
        success: true,
        amount: response.amount,
        txHash: response.txHash
      };
    } catch (error) {
      ErrorHandler.logError('Claim Royalties', error);
      throw new Error('Failed to claim royalties: ' + error.message);
    }
  }

  getExplorerUrl(ipAssetId) {
    return `${STORY_AENEID_CONFIG.explorerUrl}/ip/${ipAssetId}`;
  }

  formatIPAssetId(id) {
    if (!id) return '';
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
  }
}

export default new StoryProtocolService();
