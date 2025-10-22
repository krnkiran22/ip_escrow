import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ChevronDown, User, Briefcase, Folder, Settings, LogOut, Copy } from 'lucide-react';
import Button from '../ui/Button';

const WalletConnect = ({ isConnected = false }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [walletAddress] = useState('0x1234...5678');
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText('0x1234567890abcdef');
    // You can add a toast notification here
  };
  
  const menuItems = [
    { name: 'View Profile', path: '/profile', icon: User },
    { name: 'My Projects', path: '/dashboard', icon: Briefcase },
    { name: 'IP Portfolio', path: '/portfolio', icon: Folder },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  if (!isConnected) {
    return (
      <Button variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }
  
  return (
    <div className="relative">
      <div 
        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        <span className="text-sm font-medium text-slate-900">{walletAddress}</span>
        <ChevronDown className="w-4 h-4 text-slate-600" />
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
                <span className="text-xs text-slate-600 font-mono">{walletAddress}</span>
                <Copy 
                  className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" 
                  onClick={handleCopyAddress}
                />
              </div>
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
                onClick={() => {
                  setDropdownOpen(false);
                  // Add disconnect logic here
                }}
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
};

export default WalletConnect;
