import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  collaborator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending',
    index: true
  },
  proposal: {
    type: String,
    required: [true, 'Proposal is required'],
    trim: true,
    minlength: [50, 'Proposal must be at least 50 characters'],
    maxlength: [2000, 'Proposal cannot exceed 2000 characters']
  },
  hourlyRate: {
    type: String,  // wei per hour (optional)
    default: null
  },
  estimatedDuration: {
    type: Number,  // in days
    min: 1
  },
  coverLetter: {
    type: String,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  },
  portfolio: [{
    title: String,
    description: String,
    url: String,
    ipfsHash: String
  }],
  attachments: [{
    name: String,
    ipfsHash: String,
    type: String,
    size: Number
  }],
  // Review data
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  // Blockchain data (when approved)
  blockchainData: {
    txHash: String,
    blockNumber: Number,
    approvedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate applications
applicationSchema.index({ project: 1, collaborator: 1 }, { unique: true });
applicationSchema.index({ collaborator: 1, status: 1 });
applicationSchema.index({ project: 1, status: 1, createdAt: -1 });

// Virtual for applicant details
applicationSchema.virtual('applicant', {
  ref: 'User',
  localField: 'collaborator',
  foreignField: '_id',
  justOne: true
});

// Method to approve application
applicationSchema.methods.approve = function(reviewerId, txHash, blockNumber) {
  this.status = 'approved';
  this.reviewedAt = new Date();
  this.reviewedBy = reviewerId;
  if (txHash) {
    this.blockchainData = {
      txHash,
      blockNumber,
      approvedAt: new Date()
    };
  }
  return this.save();
};

// Method to reject application
applicationSchema.methods.reject = function(reviewerId, notes) {
  this.status = 'rejected';
  this.reviewedAt = new Date();
  this.reviewedBy = reviewerId;
  this.reviewNotes = notes;
  return this.save();
};

// Method to withdraw application
applicationSchema.methods.withdraw = function() {
  this.status = 'withdrawn';
  return this.save();
};

// Static method to get pending applications for project
applicationSchema.statics.findPendingForProject = function(projectId) {
  return this.find({ 
    project: projectId, 
    status: 'pending' 
  })
  .populate('collaborator', 'username walletAddress reputationScore stats')
  .sort({ createdAt: -1 });
};

// Static method to get user's applications
applicationSchema.statics.findByCollaborator = function(collaboratorId, status = null) {
  const query = { collaborator: collaboratorId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('project', 'title description budget status creator')
    .sort({ createdAt: -1 });
};

// Pre-save hook to reject other pending applications when one is approved
applicationSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'approved') {
    // Reject all other pending applications for this project
    await this.constructor.updateMany(
      {
        project: this.project,
        _id: { $ne: this._id },
        status: 'pending'
      },
      {
        status: 'rejected',
        reviewedAt: new Date(),
        reviewNotes: 'Another collaborator was selected for this project'
      }
    );
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
