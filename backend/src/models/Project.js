import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  category: {
    type: String,
    enum: ['development', 'design', 'writing', 'marketing', 'video', 'music', 'other'],
    default: 'other'
  },
  budget: {
    type: String,  // Store as string to handle BigInt (in wei)
    required: true,
    validate: {
      validator: function(v) {
        return BigInt(v) > 0n;
      },
      message: 'Budget must be greater than 0'
    }
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'open',
    index: true
  },
  contractAddress: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    index: true,
    validate: {
      validator: function(v) {
        return !v || /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid contract address format'
    }
  },
  collaborator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  // Blockchain data
  blockchainData: {
    projectId: Number,  // On-chain project ID
    txHash: String,     // Creation transaction hash
    blockNumber: Number,
    deployedAt: Date
  },
  // IPFS metadata
  metadataUri: {
    type: String,  // IPFS hash
    validate: {
      validator: function(v) {
        return !v || /^Qm[a-zA-Z0-9]{44}$|^baf[a-zA-Z0-9]+$/.test(v);
      },
      message: 'Invalid IPFS hash format'
    }
  },
  // Project details
  requirements: [String],
  skills: [String],
  attachments: [{
    name: String,
    ipfsHash: String,
    type: String,
    size: Number
  }],
  // Timeline
  deadline: Date,
  estimatedDuration: Number,  // in days
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  // Financial
  milestoneCount: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: String,  // wei
    default: '0'
  },
  platformFee: {
    type: String,  // wei
    default: '0'
  },
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Metrics
  viewCount: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
projectSchema.index({ creator: 1, status: 1 });
projectSchema.index({ collaborator: 1, status: 1 });
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ isPublic: 1, status: 1 });
projectSchema.index({ title: 'text', description: 'text' });

// Virtual for milestones
projectSchema.virtual('milestones', {
  ref: 'Milestone',
  localField: '_id',
  foreignField: 'project'
});

// Virtual for applications
projectSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'project'
});

// Virtual for IP assets
projectSchema.virtual('ipAssets', {
  ref: 'IPAsset',
  localField: '_id',
  foreignField: 'project'
});

// Method to check if user is creator
projectSchema.methods.isCreator = function(userId) {
  return this.creator.toString() === userId.toString();
};

// Method to check if user is collaborator
projectSchema.methods.isCollaborator = function(userId) {
  return this.collaborator && this.collaborator.toString() === userId.toString();
};

// Method to check if user can edit
projectSchema.methods.canEdit = function(userId) {
  return this.isCreator(userId) && this.status === 'open';
};

// Method to update status
projectSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'in_progress' && !this.startedAt) {
    this.startedAt = new Date();
  } else if (newStatus === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  } else if (newStatus === 'cancelled' && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
  return this.save();
};

// Static method to get projects by filter
projectSchema.statics.findByFilter = function(filters = {}) {
  const query = {};
  
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.creator) query.creator = filters.creator;
  if (filters.collaborator) query.collaborator = filters.collaborator;
  if (filters.isPublic !== undefined) query.isPublic = filters.isPublic;
  
  if (filters.minBudget || filters.maxBudget) {
    query.budget = {};
    if (filters.minBudget) query.budget.$gte = filters.minBudget;
    if (filters.maxBudget) query.budget.$lte = filters.maxBudget;
  }
  
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query);
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
