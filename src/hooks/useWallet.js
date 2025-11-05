import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi';
import { STORY_AENEID_CONFIG } from '../config/constants';
import notificationService from '../services/notificationService';
import ErrorHandler from '../services/errorHandler';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    watch: true
  });

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    if (isConnected && chain) {
      const wrongNetwork = chain.id !== STORY_AENEID_CONFIG.chainId;
      setIsWrongNetwork(wrongNetwork);
      
      if (wrongNetwork) {
        notificationService.wrongNetwork(STORY_AENEID_CONFIG.name);
      }
    }
  }, [isConnected, chain]);

  useEffect(() => {
    if (address) {
      localStorage.setItem('walletAddress', address);
    } else {
      localStorage.removeItem('walletAddress');
    }
  }, [address]);

  const handleConnect = async (connectorIndex = 0) => {
    try {
      await connect({ connector: connectors[connectorIndex] });
      notificationService.walletConnected(address);
    } catch (error) {
      ErrorHandler.handleTransactionError(error, 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      localStorage.removeItem('walletAddress');
      notificationService.walletDisconnected();
    } catch (error) {
      ErrorHandler.handleTransactionError(error, 'Failed to disconnect wallet');
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: STORY_AENEID_CONFIG.chainId });
      notificationService.networkSwitched(STORY_AENEID_CONFIG.name);
      setIsWrongNetwork(false);
    } catch (error) {
      ErrorHandler.handleTransactionError(error, 'Failed to switch network');
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getBalanceFormatted = () => {
    if (!balance) return '0';
    return parseFloat(balance.formatted).toFixed(4);
  };

  const refreshBalance = () => {
    refetchBalance();
  };

  return {
    // Wallet State
    address,
    isConnected,
    chain,
    balance: balance?.value,
    balanceFormatted: getBalanceFormatted(),
    isWrongNetwork,
    
    // Connection
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,
    connectors,
    
    // Utilities
    formatAddress,
    refreshBalance,
    
    // Network Info
    chainId: chain?.id,
    chainName: chain?.name,
    expectedChainId: STORY_AENEID_CONFIG.chainId,
    expectedChainName: STORY_AENEID_CONFIG.name
  };
}

export default useWallet;
