import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  milestoneIndex: {
    type: Number,
    required: true,
    min: 0
  },
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Milestone description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  amount: {
    type: String,  // wei
    required: true,
    validate: {
      validator: function(v) {
        return BigInt(v) > 0n;
      },
      message: 'Amount must be greater than 0'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'submitted', 'approved', 'rejected', 'revision_requested'],
    default: 'pending',
    index: true
  },
  // Deliverable
  deliverable: {
    description: String,
    ipfsHash: String,
    files: [{
      name: String,
      ipfsHash: String,
      type: String,
      size: Number
    }],
    submittedAt: Date
  },
  // IP Asset registration
  ipAssetId: {
    type: String,
    sparse: true,
    index: true
  },
  ipMetadataUri: String,
  ipRegisteredAt: Date,
  // Review/Feedback
  feedback: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rejectionReason: String,
  revisionNotes: String,
  // Blockchain data
  blockchainData: {
    txHash: String,
    blockNumber: Number,
    approvedTxHash: String,
    approvedBlockNumber: Number
  },
  // Timestamps
  startedAt: Date,
  submittedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  deadline: Date,
  // Version tracking for revisions
  revisionCount: {
    type: Number,
    default: 0
  },
  previousVersions: [{
    ipfsHash: String,
    submittedAt: Date,
    rejectionReason: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for project + milestone index
milestoneSchema.index({ project: 1, milestoneIndex: 1 }, { unique: true });
milestoneSchema.index({ project: 1, status: 1 });
milestoneSchema.index({ ipAssetId: 1 }, { sparse: true });

// Virtual for IP asset
milestoneSchema.virtual('ipAsset', {
  ref: 'IPAsset',
  localField: 'ipAssetId',
  foreignField: 'assetId',
  justOne: true
});

// Method to submit deliverable
milestoneSchema.methods.submitDeliverable = function(data) {
  this.deliverable = {
    description: data.description,
    ipfsHash: data.ipfsHash,
    files: data.files || [],
    submittedAt: new Date()
  };
  this.status = 'submitted';
  this.submittedAt = new Date();
  return this.save();
};

// Method to approve milestone
milestoneSchema.methods.approve = function(txHash, blockNumber) {
  this.status = 'approved';
  this.approvedAt = new Date();
  if (txHash) {
    this.blockchainData = {
      ...this.blockchainData,
      approvedTxHash: txHash,
      approvedBlockNumber: blockNumber
    };
  }
  return this.save();
};

// Method to reject milestone
milestoneSchema.methods.reject = function(reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.rejectedAt = new Date();
  
  // Store in version history
  if (this.deliverable) {
    this.previousVersions.push({
      ipfsHash: this.deliverable.ipfsHash,
      submittedAt: this.deliverable.submittedAt,
      rejectionReason: reason
    });
  }
  
  return this.save();
};

// Method to request revision
milestoneSchema.methods.requestRevision = function(notes) {
  this.status = 'revision_requested';
  this.revisionNotes = notes;
  this.revisionCount += 1;
  
  // Store in version history
  if (this.deliverable) {
    this.previousVersions.push({
      ipfsHash: this.deliverable.ipfsHash,
      submittedAt: this.deliverable.submittedAt,
      rejectionReason: `Revision requested: ${notes}`
    });
  }
  
  return this.save();
};

// Method to add feedback
milestoneSchema.methods.addFeedback = function(userId, message) {
  this.feedback.push({
    from: userId,
    message,
    createdAt: new Date()
  });
  return this.save();
};

// Method to register IP asset
milestoneSchema.methods.registerIPAsset = function(assetId, metadataUri) {
  this.ipAssetId = assetId;
  this.ipMetadataUri = metadataUri;
  this.ipRegisteredAt = new Date();
  return this.save();
};

// Static method to get milestones by status
milestoneSchema.statics.findByStatus = function(projectId, status) {
  return this.find({ project: projectId, status });
};

// Static method to get pending approvals
milestoneSchema.statics.findPendingApprovals = function(projectId) {
  return this.find({ 
    project: projectId, 
    status: 'submitted' 
  }).sort({ submittedAt: 1 });
};

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;
