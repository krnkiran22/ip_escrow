import { useState } from 'react';
import { Download, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

// IPEscrow ABI
const escrowAbi = parseAbi([
  'function approveMilestone(uint256 _projectId, uint256 _index)',
]);

export default function MilestoneReview({ project, milestone, onSuccess }) {
  const { address } = useAccount();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleApprove = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!confirm(`Approve milestone and release ${milestone.amount} ETH to freelancer?`)) {
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Get approval data from backend
      const response = await axios.put(`${API_URL}/milestones/${milestone._id}/approve`);
      const { data } = response.data;

      console.log('Approval data:', data);

      // Step 2: Call smart contract (automatically releases payment)
      const contractAddress = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;

      await writeContract({
        address: contractAddress,
        abi: escrowAbi,
        functionName: 'approveMilestone',
        args: [
          BigInt(data.contractParams.projectId),
          BigInt(data.contractParams.index)
        ]
      });

    } catch (error) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to approve milestone');
      setIsProcessing(false);
    }
  };

  // Handle confirmation
  if (isSuccess && hash && isProcessing) {
    (async () => {
      try {
        // Step 3: Confirm in backend
        await axios.put(`${API_URL}/milestones/${milestone._id}/confirm-approval`, {
          txHash: hash
        });

        toast.success(`Milestone approved! Payment of ${milestone.amount} ETH released.`);
        setIsProcessing(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Confirmation error:', error);
        toast.error('Payment released but failed to update database');
        setIsProcessing(false);
      }
    })();
  }

  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      toast.error('Please provide a detailed reason (minimum 10 characters)');
      return;
    }

    try {
      await axios.put(`${API_URL}/milestones/${milestone._id}/reject`, {
        reason: rejectionReason
      });

      toast.success('Milestone rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject milestone');
    }
  };

  const downloadDeliverable = () => {
    if (milestone.deliverable?.ipfsHash) {
      const ipfsUrl = `${IPFS_GATEWAY}${milestone.deliverable.ipfsHash}`;
      window.open(ipfsUrl, '_blank');
    } else if (milestone.deliverable?.files?.[0]?.ipfsHash) {
      const ipfsUrl = `${IPFS_GATEWAY}${milestone.deliverable.files[0].ipfsHash}`;
      window.open(ipfsUrl, '_blank');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">
          Review Milestone {milestone.milestoneIndex + 1}
        </h3>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
          Awaiting Review
        </span>
      </div>

      {/* Deliverable Info */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Deliverable:</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <p className="font-mono">
              IPFS: {milestone.deliverable?.ipfsHash?.slice(0, 20) || milestone.deliverable?.files?.[0]?.ipfsHash?.slice(0, 20)}...
            </p>
            <p className="text-xs mt-1">
              Submitted {milestone.submittedAt ? new Date(milestone.submittedAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>
          <button
            onClick={downloadDeliverable}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Description */}
      {milestone.deliverable?.description && (
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 mb-1">Description:</p>
          <p className="text-slate-600 text-sm leading-relaxed">
            {milestone.deliverable.description}
          </p>
        </div>
      )}

      {/* Payment Info */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-900 mb-1">
              Payment will be automatically released
            </p>
            <p className="text-emerald-700">
              Upon approval, {milestone.amount} ETH will be sent directly to the freelancer's wallet from the smart contract.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isWriting || isConfirming || isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" />
          Request Revisions
        </button>
        <button
          onClick={handleApprove}
          disabled={isWriting || isConfirming || isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {(isWriting || isConfirming || isProcessing) && <Loader className="w-4 h-4 animate-spin" />}
          <CheckCircle className="w-4 h-4" />
          {isWriting || isConfirming || isProcessing
            ? 'Processing...'
            : `Approve & Release ${milestone.amount} ETH`}
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Request Revisions</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain what needs to be changed..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
