import Modal from '../ui/Modal';
import { Wallet, ExternalLink } from 'lucide-react';
import { useConnect } from 'wagmi';
import Button from '../ui/Button';

const WalletConnectModal = ({ isOpen, onClose }) => {
  const { connect, connectors, isPending } = useConnect();
  
  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect with MetaMask',
      icon: '🦊',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan with mobile wallet',
      icon: '📱',
      popular: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase',
      icon: '💙',
      popular: false
    },
    {
      id: 'injected',
      name: 'Browser Wallet',
      description: 'Connect with any browser wallet',
      icon: '🌐',
      popular: false
    }
  ];
  
  const handleConnect = async (connector) => {
    try {
      await connect({ connector });
      onClose();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Wallet" size="medium">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Choose your preferred wallet to connect to IP Escrow. You'll need to sign a message to verify ownership.
        </p>
        
        <div className="space-y-3">
          {walletOptions.map((wallet) => {
            const connector = connectors.find(c => 
              c.name.toLowerCase().includes(wallet.id.toLowerCase())
            );
            
            return (
              <button
                key={wallet.id}
                onClick={() => connector && handleConnect(connector)}
                disabled={!connector || isPending}
                className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="text-3xl">{wallet.icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{wallet.name}</span>
                    {wallet.popular && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-700 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{wallet.description}</p>
                </div>
                {!connector && (
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-cyan-600" />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-slate-500 text-center">
            By connecting a wallet, you agree to our{' '}
            <a href="/terms" className="text-cyan-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default WalletConnectModal;
