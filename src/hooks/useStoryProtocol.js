import { useState, useEffect, useCallback } from 'react';
import { getWalletClient, initializeStoryClient, isOnStoryNetwork, switchToStoryNetwork } from '../services/storyProtocol';

/**
 * React hook for Story Protocol client management
 * @returns {object} - Story Protocol client state and methods
 */
export const useStoryProtocol = () => {
  const [storyClient, setStoryClient] = useState(null);
  const [publicClient, setPublicClient] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  /**
   * Initialize Story Protocol client
   */
  const initialize = useCallback(async () => {
    if (isInitialized || isConnecting) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Check if on correct network
      const onCorrectNetwork = await isOnStoryNetwork();
      setIsCorrectNetwork(onCorrectNetwork);

      if (!onCorrectNetwork) {
        setError('Please switch to Story testnet');
        setIsConnecting(false);
        return;
      }

      // Get wallet client
      const walletClient = await getWalletClient();
      const [address] = await walletClient.getAddresses();
      setWalletAddress(address);

      // Initialize Story Protocol client
      const { storyClient: client, publicClient: pubClient } = await initializeStoryClient(walletClient);
      
      setStoryClient(client);
      setPublicClient(pubClient);
      setIsInitialized(true);
      
      console.log('✅ Story Protocol initialized');
    } catch (err) {
      console.error('❌ Story Protocol initialization failed:', err);
      setError(err.message);
      setIsInitialized(false);
    } finally {
      setIsConnecting(false);
    }
  }, [isInitialized, isConnecting]);

  /**
   * Switch to Story network
   */
  const switchNetwork = useCallback(async () => {
    try {
      await switchToStoryNetwork();
      setIsCorrectNetwork(true);
      
      // Re-initialize after network switch
      setIsInitialized(false);
      await initialize();
    } catch (err) {
      console.error('❌ Network switch failed:', err);
      setError(err.message);
    }
  }, [initialize]);

  /**
   * Disconnect wallet and reset state
   */
  const disconnect = useCallback(() => {
    setStoryClient(null);
    setPublicClient(null);
    setIsInitialized(false);
    setWalletAddress(null);
    setError(null);
    console.log('🔌 Disconnected from Story Protocol');
  }, []);

  /**
   * Reconnect (re-initialize)
   */
  const reconnect = useCallback(async () => {
    disconnect();
    await initialize();
  }, [disconnect, initialize]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!isInitialized && !isConnecting && !error) {
      initialize();
    }
  }, [isInitialized, isConnecting, error, initialize]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        reconnect();
      }
    };

    const handleChainChanged = () => {
      reconnect();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect, reconnect]);

  return {
    // Clients
    storyClient,
    publicClient,
    
    // State
    isInitialized,
    isConnecting,
    error,
    walletAddress,
    isCorrectNetwork,
    
    // Methods
    initialize,
    switchNetwork,
    disconnect,
    reconnect,
  };
};

export default useStoryProtocol;
