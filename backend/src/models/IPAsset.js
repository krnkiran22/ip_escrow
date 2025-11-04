import mongoose from 'mongoose';

const ipAssetSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone',
    default: null,
    index: true
  },
  // Story Protocol specific fields
  assetId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ipId: {
    type: String,  // Story Protocol IP ID
    required: true,
    unique: true,
    index: true
  },
  // IPFS data
  ipfsHash: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^Qm[a-zA-Z0-9]{44}$|^baf[a-zA-Z0-9]+$/.test(v);
      },
      message: 'Invalid IPFS hash format'
    }
  },
  metadataUri: {
    type: String,
    required: true
  },
  // Creator information
  creatorWallet: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Asset metadata
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  assetType: {
    type: String,
    enum: ['code', 'design', 'writing', 'video', 'audio', 'image', 'document', 'other'],
    required: true
  },
  tags: [String],
  // Licensing
  licenseTerms: {
    type: {
      type: String,
      enum: ['commercial', 'non-commercial', 'attribution', 'custom'],
      default: 'attribution'
    },
    royaltyPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    commercialUse: {
      type: Boolean,
      default: false
    },
    derivativeWorks: {
      type: Boolean,
      default: true
    },
    attribution: {
      type: Boolean,
      default: true
    },
    customTerms: String
  },
  // Parent/Child relationships for derivative works
  parentAssets: [{
    assetId: String,
    ipId: String,
    relationship: {
      type: String,
      enum: ['derived_from', 'remix', 'adaptation', 'collection'],
      default: 'derived_from'
    }
  }],
  childAssets: [{
    assetId: String,
    ipId: String,
    relationship: String
  }],
  // Licensing and royalties
  licenses: [{
    licensee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    licenseeWallet: String,
    licenseType: String,
    amount: String,  // wei
    txHash: String,
    issuedAt: Date,
    expiresAt: Date,
    terms: String
  }],
  // Royalty tracking
  royalties: {
    totalEarned: {
      type: String,  // wei
      default: '0'
    },
    paymentCount: {
      type: Number,
      default: 0
    },
    lastPaymentAt: Date
  },
  // Blockchain data
  blockchainData: {
    registrationTxHash: String,
    registrationBlockNumber: Number,
    tokenContract: String,
    tokenId: String
  },
  registeredAt: {
    type: Date,
    required: true,
    index: true
  },
  // Status
  status: {
    type: String,
    enum: ['active', 'archived', 'disputed', 'transferred'],
    default: 'active'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  licenseCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ipAssetSchema.index({ creator: 1, createdAt: -1 });
ipAssetSchema.index({ assetType: 1, isPublic: 1 });
ipAssetSchema.index({ tags: 1 });
ipAssetSchema.index({ 'parentAssets.assetId': 1 });
ipAssetSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Method to add license
ipAssetSchema.methods.addLicense = function(licenseData) {
  this.licenses.push(licenseData);
  this.licenseCount += 1;
  return this.save();
};

// Method to add royalty payment
ipAssetSchema.methods.addRoyaltyPayment = function(amount) {
  const currentTotal = BigInt(this.royalties.totalEarned);
  const newAmount = BigInt(amount);
  this.royalties.totalEarned = (currentTotal + newAmount).toString();
  this.royalties.paymentCount += 1;
  this.royalties.lastPaymentAt = new Date();
  return this.save();
};

// Method to add child asset
ipAssetSchema.methods.addChildAsset = function(childAssetId, childIpId, relationship) {
  this.childAssets.push({
    assetId: childAssetId,
    ipId: childIpId,
    relationship
  });
  return this.save();
};

// Method to increment view count
ipAssetSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment download count
ipAssetSchema.methods.incrementDownloads = function() {
  this.downloadCount += 1;
  return this.save();
};

// Static method to find by creator
ipAssetSchema.statics.findByCreator = function(creatorId, status = 'active') {
  return this.find({ creator: creatorId, status })
    .sort({ createdAt: -1 })
    .populate('project', 'title')
    .populate('milestone', 'title');
};

// Static method to search IP assets
ipAssetSchema.statics.searchAssets = function(query, filters = {}) {
  const searchQuery = { isPublic: true };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (filters.assetType) searchQuery.assetType = filters.assetType;
  if (filters.tags && filters.tags.length > 0) {
    searchQuery.tags = { $in: filters.tags };
  }
  if (filters.creator) searchQuery.creator = filters.creator;
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .populate('creator', 'username walletAddress reputationScore');
};

// Static method to get genealogy tree
ipAssetSchema.statics.getGenealogy = async function(assetId) {
  const asset = await this.findOne({ assetId })
    .populate('parentAssets.assetId')
    .populate('childAssets.assetId');
  
  if (!asset) return null;
  
  // Recursively get parents
  const getParents = async (currentAsset) => {
    if (!currentAsset.parentAssets || currentAsset.parentAssets.length === 0) {
      return [];
    }
    
    const parents = await Promise.all(
      currentAsset.parentAssets.map(async (parent) => {
        const parentAsset = await this.findOne({ assetId: parent.assetId });
        if (parentAsset) {
          return {
            ...parentAsset.toObject(),
            relationship: parent.relationship,
            ancestors: await getParents(parentAsset)
          };
        }
        return null;
      })
    );
    
    return parents.filter(Boolean);
  };
  
  // Recursively get children
  const getChildren = async (currentAsset) => {
    if (!currentAsset.childAssets || currentAsset.childAssets.length === 0) {
      return [];
    }
    
    const children = await Promise.all(
      currentAsset.childAssets.map(async (child) => {
        const childAsset = await this.findOne({ assetId: child.assetId });
        if (childAsset) {
          return {
            ...childAsset.toObject(),
            relationship: child.relationship,
            descendants: await getChildren(childAsset)
          };
        }
        return null;
      })
    );
    
    return children.filter(Boolean);
  };
  
  return {
    asset: asset.toObject(),
    parents: await getParents(asset),
    children: await getChildren(asset)
  };
};

const IPAsset = mongoose.model('IPAsset', ipAssetSchema);

export default IPAsset;
