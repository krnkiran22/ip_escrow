import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone',
    default: null
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  againstUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Dispute title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  reason: {
    type: String,
    required: [true, 'Dispute reason is required'],
    trim: true,
    minlength: [50, 'Reason must be at least 50 characters'],
    maxlength: [2000, 'Reason cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: [
      'quality_issue',
      'missed_deadline',
      'payment_dispute',
      'scope_disagreement',
      'communication_issue',
      'ip_violation',
      'other'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'under_review', 'resolved', 'closed', 'escalated'],
    default: 'open',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  // Evidence
  evidence: [{
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: String,
    files: [{
      name: String,
      ipfsHash: String,
      type: String,
      size: Number
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Resolution
  resolution: {
    decision: {
      type: String,
      enum: ['favor_creator', 'favor_collaborator', 'partial_refund', 'mediation', 'rejected']
    },
    explanation: String,
    refundAmount: String,  // wei
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  // Communication
  messages: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    isInternal: {  // Only visible to admins
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Blockchain data
  blockchainData: {
    txHash: String,
    blockNumber: Number,
    resolutionTxHash: String,
    resolutionBlockNumber: Number
  },
  // Timestamps
  reviewStartedAt: Date,
  resolvedAt: Date,
  closedAt: Date,
  // Assigned admin/mediator
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
disputeSchema.index({ project: 1, status: 1 });
disputeSchema.index({ raisedBy: 1, status: 1 });
disputeSchema.index({ status: 1, priority: -1, createdAt: -1 });
disputeSchema.index({ assignedTo: 1, status: 1 });

// Method to add evidence
disputeSchema.methods.addEvidence = function(userId, description, files) {
  this.evidence.push({
    submittedBy: userId,
    description,
    files,
    submittedAt: new Date()
  });
  return this.save();
};

// Method to add message
disputeSchema.methods.addMessage = function(userId, message, isInternal = false) {
  this.messages.push({
    from: userId,
    message,
    isInternal,
    createdAt: new Date()
  });
  return this.save();
};

// Method to assign to admin
disputeSchema.methods.assignTo = function(adminId) {
  this.assignedTo = adminId;
  this.assignedAt = new Date();
  if (this.status === 'open') {
    this.status = 'under_review';
    this.reviewStartedAt = new Date();
  }
  return this.save();
};

// Method to resolve dispute
disputeSchema.methods.resolve = function(adminId, decision, explanation, refundAmount = null, txHash = null) {
  this.status = 'resolved';
  this.resolution = {
    decision,
    explanation,
    refundAmount,
    resolvedBy: adminId,
    resolvedAt: new Date()
  };
  this.resolvedAt = new Date();
  
  if (txHash) {
    this.blockchainData = {
      ...this.blockchainData,
      resolutionTxHash: txHash
    };
  }
  
  return this.save();
};

// Method to close dispute
disputeSchema.methods.close = function() {
  this.status = 'closed';
  this.closedAt = new Date();
  return this.save();
};

// Method to escalate dispute
disputeSchema.methods.escalate = function() {
  this.status = 'escalated';
  this.priority = 'high';
  return this.save();
};

// Static method to get open disputes
disputeSchema.statics.findOpen = function(filters = {}) {
  const query = { status: { $in: ['open', 'under_review'] } };
  
  if (filters.priority) query.priority = filters.priority;
  if (filters.category) query.category = filters.category;
  if (filters.assignedTo) query.assignedTo = filters.assignedTo;
  
  return this.find(query)
    .populate('project', 'title')
    .populate('raisedBy', 'username walletAddress')
    .populate('againstUser', 'username walletAddress')
    .populate('assignedTo', 'username')
    .sort({ priority: -1, createdAt: 1 });
};

// Static method to get disputes by user
disputeSchema.statics.findByUser = function(userId, status = null) {
  const query = {
    $or: [
      { raisedBy: userId },
      { againstUser: userId }
    ]
  };
  
  if (status) query.status = status;
  
  return this.find(query)
    .populate('project', 'title')
    .populate('raisedBy', 'username walletAddress')
    .populate('againstUser', 'username walletAddress')
    .sort({ createdAt: -1 });
};

// Static method to get dispute statistics
disputeSchema.statics.getStatistics = async function(projectId = null) {
  const match = projectId ? { project: projectId } : {};
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    open: 0,
    under_review: 0,
    resolved: 0,
    closed: 0,
    escalated: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

const Dispute = mongoose.model('Dispute', disputeSchema);

export default Dispute;
