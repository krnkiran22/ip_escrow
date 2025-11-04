import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    lowercase: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid Ethereum address format'
    }
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  avatar: {
    type: String,  // IPFS hash or URL
  },
  reputationScore: {
    type: Number,
    default: 0,
    min: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Statistics
  stats: {
    projectsCreated: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    collaborationsCompleted: { type: Number, default: 0 },
    totalEarned: { type: String, default: '0' },  // Store as string to handle BigInt
    totalSpent: { type: String, default: '0' },
    disputesRaised: { type: Number, default: 0 },
    disputesWon: { type: Number, default: 0 }
  },
  // Social/Contact
  socialLinks: {
    twitter: String,
    github: String,
    linkedin: String,
    website: String
  },
  skills: [String],
  // Authentication
  nonce: {
    type: String,
    default: () => Math.floor(Math.random() * 1000000).toString()
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ reputationScore: -1 });
userSchema.index({ createdAt: -1 });

// Virtual for projects created
userSchema.virtual('projectsAsCreator', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'creator'
});

// Virtual for projects as collaborator
userSchema.virtual('projectsAsCollaborator', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'collaborator'
});

// Method to generate new nonce
userSchema.methods.generateNonce = function() {
  this.nonce = Math.floor(Math.random() * 1000000).toString();
  return this.nonce;
};

// Method to update reputation
userSchema.methods.updateReputation = function(points) {
  this.reputationScore = Math.max(0, this.reputationScore + points);
  return this.save();
};

// Method to increment stats
userSchema.methods.incrementStat = function(statName, value = 1) {
  if (this.stats[statName] !== undefined) {
    this.stats[statName] += value;
    return this.save();
  }
};

// Hide sensitive fields when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.nonce;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
