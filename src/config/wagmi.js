import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Story Aeneid Testnet
export const storyAeneid = defineChain({
  id: 1315,
  name: 'Story Aeneid Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Scan',
      url: 'https://aeneid.storyscan.xyz',
    },
  },
  testnet: true,
});

// Configure wagmi with RainbowKit
export const config = getDefaultConfig({
  appName: 'IP Escrow',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [storyAeneid],
  ssr: false,
});
