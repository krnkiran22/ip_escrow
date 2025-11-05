import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Shield, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useSignMessage } from 'wagmi';

const SignMessageModal = ({ isOpen, onClose, message, onSuccess }) => {
  const { signMessage, isPending, isSuccess } = useSignMessage();
  const [error, setError] = useState(null);
  
  const defaultMessage = message || `Welcome to IP Escrow!

By signing this message, you verify that you own this wallet address.

This won't cost you any gas fees.

Timestamp: ${new Date().toISOString()}`;
  
  const handleSign = async () => {
    try {
      setError(null);
      const signature = await signMessage({ message: defaultMessage });
      
      if (onSuccess) {
        onSuccess(signature);
      }
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to sign message:', err);
      setError(err.message || 'Failed to sign message');
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Message" size="medium">
      <div className="space-y-6">
        {!isSuccess ? (
          <>
            <div className="flex items-start gap-4 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
              <Shield className="w-6 h-6 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Why do I need to sign?</h4>
                <p className="text-sm text-slate-600">
                  Signing this message proves you own this wallet address. This is a secure, 
                  gas-free way to verify your identity without making any blockchain transactions.
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Message to Sign
              </label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                  {defaultMessage}
                </pre>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSign}
                className="flex-1"
                loading={isPending}
                disabled={isPending}
              >
                {isPending ? 'Signing...' : 'Sign Message'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Successfully Signed!</h3>
            <p className="text-slate-600">Your wallet has been verified.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SignMessageModal;
