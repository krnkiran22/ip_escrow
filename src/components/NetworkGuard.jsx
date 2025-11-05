import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { STORY_AENEID_CONFIG } from '../config/constants';
import { useNotifications } from '../hooks/useNotifications';

export default function NetworkGuard({ children }) {
  const { isConnected, isWrongNetwork, switchNetwork, chain } = useWallet();
  const { notifyWrongNetwork } = useNotifications();

  // Show notification on wrong network
  React.useEffect(() => {
    if (isConnected && isWrongNetwork) {
      notifyWrongNetwork(STORY_AENEID_CONFIG.chainName);
    }
  }, [isConnected, isWrongNetwork, notifyWrongNetwork]);

  // If not connected or on correct network, render children
  if (!isConnected || !isWrongNetwork) {
    return <>{children}</>;
  }

  // Show wrong network modal
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-8 h-8 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Wrong Network Detected
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            You're currently connected to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {chain?.name || 'Unknown Network'}
            </span>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please switch to{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {STORY_AENEID_CONFIG.chainName}
            </span>
            {' '}to continue
          </p>

          {/* Network Details */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Network Details:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Network Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {STORY_AENEID_CONFIG.chainName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Chain ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {STORY_AENEID_CONFIG.chainId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ETH
                </span>
              </div>
            </div>
          </div>

          {/* Switch Network Button */}
          <button
            onClick={switchNetwork}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg mb-4"
          >
            Switch to {STORY_AENEID_CONFIG.chainName}
          </button>

          {/* Help Text */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your wallet will prompt you to approve the network switch
          </p>

          {/* Additional Info Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a
              href={STORY_AENEID_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              View Network Explorer
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Troubleshooting Tips:
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Make sure your wallet is unlocked</li>
            <li>If switching fails, try adding the network manually in your wallet</li>
            <li>Check that you have enough ETH for gas fees</li>
            <li>Contact support if the issue persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
