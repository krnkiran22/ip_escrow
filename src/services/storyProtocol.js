import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { odyssey } from '@story-protocol/core-sdk';

// Story Testnet Configuration
const config = {
  chainId: 1513,
  transport: http(import.meta.env.VITE_STORY_NETWORK_RPC || 'https://testnet.storyrpc.io'),
  chain: odyssey,
};

/**
 * Initialize Story Protocol Client
 * @param {object} walletClient - Viem wallet client
 * @returns {object} - { storyClient, publicClient }
 */
export const initializeStoryClient = async (walletClient) => {
  try {
    const publicClient = createPublicClient(config);
    
    const storyClient = StoryClient.newClient({
      chainId: config.chainId,
      transport: config.transport,
      account: walletClient.account,
    });
    
    console.log('✅ Story Protocol client initialized successfully');
    
    return { storyClient, publicClient };
  } catch (error) {
    console.error('❌ Failed to initialize Story Protocol client:', error);
    throw error;
  }
};

/**
 * Get wallet client from browser (MetaMask)
 * @returns {object} - Viem wallet client
 */
export const getWalletClient = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed. Please install MetaMask to use this application.');
  }
  
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const walletClient = createWalletClient({
      chain: odyssey,
      transport: custom(window.ethereum),
    });
    
    const [address] = await walletClient.getAddresses();
    
    console.log('✅ Wallet connected:', address);
    
    return walletClient;
  } catch (error) {
    console.error('❌ Failed to get wallet client:', error);
    throw error;
  }
};

/**
 * Get connected wallet address
 * @returns {string} - Wallet address
 */
export const getWalletAddress = async () => {
  try {
    const walletClient = await getWalletClient();
    const [address] = await walletClient.getAddresses();
    return address;
  } catch (error) {
    console.error('❌ Failed to get wallet address:', error);
    throw error;
  }
};

/**
 * Switch to Story testnet network
 * @returns {boolean} - Success status
 */
export const switchToStoryNetwork = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x5E9' }], // 1513 in hex
    });
    
    console.log('✅ Switched to Story testnet');
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x5E9',
              chainName: 'Story Testnet',
              nativeCurrency: {
                name: 'IP',
                symbol: 'IP',
                decimals: 18,
              },
              rpcUrls: ['https://testnet.storyrpc.io'],
              blockExplorerUrls: ['https://testnet.storyscan.xyz'],
            },
          ],
        });
        
        console.log('✅ Story testnet added and switched');
        return true;
      } catch (addError) {
        console.error('❌ Failed to add Story testnet:', addError);
        throw addError;
      }
    }
    
    console.error('❌ Failed to switch network:', switchError);
    throw switchError;
  }
};

/**
 * Check if wallet is connected to Story testnet
 * @returns {boolean} - True if on Story testnet
 */
export const isOnStoryNetwork = async () => {
  if (!window.ethereum) {
    return false;
  }
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === '0x5E9'; // 1513 in hex
  } catch (error) {
    console.error('❌ Failed to check network:', error);
    return false;
  }
};

/**
 * Get Story Protocol configuration
 * @returns {object} - Configuration object
 */
export const getStoryConfig = () => {
  return {
    chainId: parseInt(import.meta.env.VITE_STORY_CHAIN_ID || '1513'),
    rpcUrl: import.meta.env.VITE_STORY_NETWORK_RPC || 'https://testnet.storyrpc.io',
    explorerUrl: import.meta.env.VITE_STORY_EXPLORER || 'https://testnet.storyscan.xyz',
    ipEscrowAddress: import.meta.env.VITE_IPESCROW_CONTRACT_ADDRESS,
    revenueVaultAddress: import.meta.env.VITE_REVENUE_VAULT_CONTRACT_ADDRESS,
  };
};

export default {
  initializeStoryClient,
  getWalletClient,
  getWalletAddress,
  switchToStoryNetwork,
  isOnStoryNetwork,
  getStoryConfig,
};
