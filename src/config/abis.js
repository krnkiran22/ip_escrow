export const ESCROW_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "createProject",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "creator", "type": "address"}],
    "name": "getProjectsByCreator",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "project", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"}
    ],
    "name": "ProjectCreated",
    "type": "event"
  }
];

export const ESCROW_PROJECT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_metadataHash", "type": "string"},
      {"internalType": "string", "name": "_ipAssetId", "type": "string"},
      {"internalType": "uint256[]", "name": "_milestoneAmounts", "type": "uint256[]"}
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_collaborator", "type": "address"}],
    "name": "approveCollaborator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_milestoneIndex", "type": "uint256"},
      {"internalType": "string", "name": "_deliverableHash", "type": "string"},
      {"internalType": "string", "name": "_deliverableIpAssetId", "type": "string"}
    ],
    "name": "submitMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_milestoneIndex", "type": "uint256"}],
    "name": "approveMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_milestoneIndex", "type": "uint256"}],
    "name": "rejectMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_milestoneIndex", "type": "uint256"},
      {"internalType": "string", "name": "_disputeMetadataHash", "type": "string"}
    ],
    "name": "raiseDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_milestoneIndex", "type": "uint256"},
      {"internalType": "address", "name": "_recipient", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"}
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProjectInfo",
    "outputs": [
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "address", "name": "collaborator", "type": "address"},
      {"internalType": "string", "name": "metadataHash", "type": "string"},
      {"internalType": "string", "name": "ipAssetId", "type": "string"},
      {"internalType": "uint256", "name": "totalBudget", "type": "uint256"},
      {"internalType": "uint256", "name": "remainingBudget", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
    "name": "getMilestone",
    "outputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "bool", "name": "completed", "type": "bool"},
      {"internalType": "string", "name": "deliverableHash", "type": "string"},
      {"internalType": "string", "name": "deliverableIpAssetId", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMilestoneCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "collaborator", "type": "address"}
    ],
    "name": "CollaboratorApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "milestoneIndex", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "deliverableHash", "type": "string"}
    ],
    "name": "MilestoneSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "milestoneIndex", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"}
    ],
    "name": "FundsReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "milestoneIndex", "type": "uint256"}
    ],
    "name": "MilestoneRejected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "milestoneIndex", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "disputeMetadataHash", "type": "string"}
    ],
    "name": "DisputeRaised",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "milestoneIndex", "type": "uint256"}
    ],
    "name": "DisputeResolved",
    "type": "event"
  }
];

export const REVENUE_VAULT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_ipAssetId", "type": "string"},
      {"internalType": "address[]", "name": "_recipients", "type": "address[]"},
      {"internalType": "uint256[]", "name": "_shares", "type": "uint256[]"}
    ],
    "name": "registerIPAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_ipAssetId", "type": "string"}],
    "name": "distributeRevenue",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_ipAssetId", "type": "string"}],
    "name": "getRevenueShares",
    "outputs": [
      {"internalType": "address[]", "name": "", "type": "address[]"},
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
