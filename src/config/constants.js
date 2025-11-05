export const STORY_AENEID_CONFIG = {
  chainId: 1513,
  name: 'Story Aeneid Testnet',
  rpcUrl: import.meta.env.VITE_STORY_RPC_URL || 'https://testnet.storyrpc.io',
  explorerUrl: import.meta.env.VITE_EXPLORER_URL || 'https://explorer.story.foundation',
  nativeCurrency: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18
  }
};

export const CONTRACTS = {
  ESCROW_FACTORY: import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS,
  REVENUE_VAULT: import.meta.env.VITE_REVENUE_VAULT_ADDRESS,
};

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const IPFS_CONFIG = {
  apiKey: import.meta.env.VITE_PINATA_API_KEY,
  secretKey: import.meta.env.VITE_PINATA_SECRET_KEY,
  gateway: import.meta.env.VITE_PINATA_GATEWAY || 'gateway.pinata.cloud',
};

export const APP_CONFIG = {
  platformFeePercent: 2,
  maxMilestones: 10,
  minBudget: 0.01, // ETH
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxTotalFileSize: 50 * 1024 * 1024, // 50MB
  pollingInterval: parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 30000,
  enablePolling: import.meta.env.VITE_ENABLE_POLLING === 'true',
};

export const ERROR_MESSAGES = {
  'insufficient funds': 'You don\'t have enough ETH to complete this transaction.',
  'user rejected': 'You cancelled the transaction.',
  'network error': 'Connection issue. Please check your internet.',
  'contract reverted': 'This action is not allowed. Please check the requirements.',
  'nonce too low': 'Transaction error. Please refresh and try again.',
  'ACTION_REJECTED': 'Transaction rejected by user',
  'INSUFFICIENT_FUNDS': 'Insufficient funds for transaction',
  'NETWORK_ERROR': 'Network error. Please check your connection',
  'UNPREDICTABLE_GAS_LIMIT': 'Transaction would fail. Please check parameters',
};
