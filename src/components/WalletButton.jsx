import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '../hooks/useWallet';
import { STORY_AENEID_CONFIG } from '../config/constants';

export default function WalletButton() {
  const { 
    address, 
    isConnected, 
    chain, 
    balance, 
    isWrongNetwork,
    switchNetwork,
    formatAddress 
  } = useWallet();

  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <>
          {/* Balance Display (Optional) */}
          {showBalance && balance && (
            <div className="hidden sm:flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {parseFloat(balance).toFixed(4)} ETH
              </span>
            </div>
          )}

          {/* Wrong Network Warning */}
          {isWrongNetwork && (
            <button
              onClick={switchNetwork}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <span className="text-sm font-medium">Wrong Network</span>
            </button>
          )}

          {/* Connected - Show RainbowKit Button */}
          <ConnectButton
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: showBalance,
            }}
          />
        </>
      ) : (
        /* Disconnected - Show Custom Connect Button */
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                          />
                        </svg>
                        <span>Connect Wallet</span>
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button 
                        onClick={openChainModal} 
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                          />
                        </svg>
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={openChainModal}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div className="w-5 h-5">
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                className="w-5 h-5"
                              />
                            )}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {chain.name}
                        </span>
                      </button>

                      <button 
                        onClick={openAccountModal} 
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {account.displayName}
                        </span>
                        {account.displayBalance && showBalance && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({account.displayBalance})
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      )}
    </div>
  );
}
