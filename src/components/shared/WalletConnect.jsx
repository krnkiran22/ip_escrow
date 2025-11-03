import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { User, Briefcase, Folder, Settings, LogOut, Copy, Wallet } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import toast from 'react-hot-toast';

const WalletConnect = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    }
  };
  
  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
    toast.success('Wallet disconnected');
  };
  
  const menuItems = [
    { name: 'View Profile', path: '/profile', icon: User },
    { name: 'My Projects', path: '/dashboard', icon: Briefcase },
    { name: 'IP Portfolio', path: '/portfolio', icon: Folder },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  return (
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
          (!authenticationStatus || authenticationStatus === 'authenticated');

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
                    className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="relative">
                  <div 
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-900">
                      {account.displayName}
                    </span>
                    {chain.hasIcon && (
                      <div
                        className="w-5 h-5 rounded-full overflow-hidden"
                        style={{
                          background: chain.iconBackground,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-5 h-5"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {dropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setDropdownOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600 font-mono">
                              {formatAddress(address)}
                            </span>
                            <Copy 
                              className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" 
                              onClick={handleCopyAddress}
                            />
                          </div>
                          <button
                            onClick={openChainModal}
                            className="mt-2 text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                          >
                            {chain.name}
                          </button>
                        </div>
                        
                        {menuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <item.icon className="w-5 h-5 text-slate-600" />
                            <span className="text-sm text-slate-900">{item.name}</span>
                          </Link>
                        ))}
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            className="w-full px-4 py-3 rounded-lg hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-600 transition"
                            onClick={handleDisconnect}
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Disconnect</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;
