import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'project_created',
      'funds_deposited', 
      'milestone_paid',
      'refund',
      'royalty_payment',
      'platform_fee',
      'dispute_resolution'
    ],
    required: true,
    index: true
  },
  amount: {
    type: String,  // wei
    required: true,
    validate: {
      validator: function(v) {
        return BigInt(v) >= 0n;
      },
      message: 'Amount must be non-negative'
    }
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{64}$/.test(v);
      },
      message: 'Invalid transaction hash format'
    }
  },
  fromAddress: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid from address format'
    }
  },
  toAddress: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid to address format'
    }
  },
  // Blockchain details
  blockNumber: {
    type: Number,
    required: true,
    index: true
  },
  blockTimestamp: {
    type: Date,
    required: true,
    index: true
  },
  gasUsed: String,
  gasPrice: String,
  // Related entities
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone',
    default: null
  },
  ipAsset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IPAsset',
    default: null
  },
  // Additional metadata
  metadata: {
    type: Map,
    of: String
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'confirmed'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
transactionSchema.index({ project: 1, type: 1 });
transactionSchema.index({ project: 1, blockTimestamp: -1 });
transactionSchema.index({ fromAddress: 1, blockTimestamp: -1 });
transactionSchema.index({ toAddress: 1, blockTimestamp: -1 });
transactionSchema.index({ type: 1, blockTimestamp: -1 });
transactionSchema.index({ milestone: 1 });

// Static method to get transactions by project
transactionSchema.statics.findByProject = function(projectId, type = null) {
  const query = { project: projectId };
  if (type) query.type = type;
  return this.find(query).sort({ blockTimestamp: -1 });
};

// Static method to get transactions by address
transactionSchema.statics.findByAddress = function(address, type = null) {
  const query = {
    $or: [
      { fromAddress: address.toLowerCase() },
      { toAddress: address.toLowerCase() }
    ]
  };
  if (type) query.type = type;
  return this.find(query).sort({ blockTimestamp: -1 });
};

// Static method to get recent transactions
transactionSchema.statics.findRecent = function(limit = 10) {
  return this.find()
    .sort({ blockTimestamp: -1 })
    .limit(limit)
    .populate('project', 'title')
    .populate('milestone', 'title');
};

// Static method to calculate total volume
transactionSchema.statics.getTotalVolume = async function(filter = {}) {
  const result = await this.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { 
          $sum: { $toLong: '$amount' }
        }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total.toString() : '0';
};

// Static method to get volume by type
transactionSchema.statics.getVolumeByType = async function(projectId = null) {
  const match = projectId ? { project: projectId } : {};
  
  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        total: { $sum: { $toLong: '$amount' } }
      }
    }
  ]);
  
  return result.map(r => ({
    type: r._id,
    count: r.count,
    total: r.total.toString()
  }));
};

// Method to check if transaction is incoming for address
transactionSchema.methods.isIncoming = function(address) {
  return this.toAddress.toLowerCase() === address.toLowerCase();
};

// Method to check if transaction is outgoing for address
transactionSchema.methods.isOutgoing = function(address) {
  return this.fromAddress.toLowerCase() === address.toLowerCase();
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
