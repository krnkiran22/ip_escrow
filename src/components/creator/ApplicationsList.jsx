import { useState } from 'react';
import { User, Calendar, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// IPEscrow ABI
const escrowAbi = parseAbi([
  'function approveCollaborator(uint256 _projectId, address _collaborator)',
]);

export default function ApplicationsList({ projectId, onChainProjectId, applications, onUpdate }) {
  const { address } = useAccount();
  const [approvingId, setApprovingId] = useState(null);
  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleApprove = async (application) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!onChainProjectId) {
      toast.error('Project not deployed on blockchain');
      return;
    }

    setApprovingId(application._id);

    try {
      // Step 1: Get approval data from backend
      const response = await axios.put(`${API_URL}/applications/${application._id}/approve`);
      const { data } = response.data;

      console.log('Approval data:', data);

      // Step 2: Call smart contract
      const contractAddress = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;
      
      await writeContract({
        address: contractAddress,
        abi: escrowAbi,
        functionName: 'approveCollaborator',
        args: [BigInt(data.contractParams.projectId), data.contractParams.collaborator]
      });

    } catch (error) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to approve collaborator');
      setApprovingId(null);
    }
  };

  // Handle confirmation
  if (isSuccess && hash && approvingId) {
    (async () => {
      try {
        // Step 3: Confirm in backend
        await axios.put(`${API_URL}/applications/${approvingId}/confirm`, {
          txHash: hash
        });

        toast.success('Collaborator approved successfully!');
        setApprovingId(null);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Confirmation error:', error);
        toast.error('Blockchain approved but failed to update database');
        setApprovingId(null);
      }
    })();
  }

  const handleReject = async (application) => {
    if (!confirm('Are you sure you want to reject this application?')) {
      return;
    }

    try {
      await axios.put(`${API_URL}/applications/${application._id}/reject`, {
        notes: 'Not selected for this project'
      });
      toast.success('Application rejected');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject application');
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No applications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application._id}
          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">
                  {application.collaborator?.username || 'Anonymous'}
                </h3>
                <p className="text-sm text-slate-500">
                  {application.collaborator?.walletAddress?.slice(0, 6)}...
                  {application.collaborator?.walletAddress?.slice(-4)}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${application.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
              ${application.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : ''}
              ${application.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
            `}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>

          {/* Proposal */}
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-1">Proposal:</p>
            <p className="text-slate-600 text-sm leading-relaxed">
              {application.proposal}
            </p>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Duration:</span>
              <span>{application.estimatedDuration ? `${application.estimatedDuration} days` : 'Not specified'}</span>
            </div>
            {application.hourlyRate && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-medium">Rate:</span>
                <span>{application.hourlyRate} ETH/hr</span>
              </div>
            )}
          </div>

          {/* Portfolio Links */}
          {application.portfolio && application.portfolio.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Portfolio:</p>
              <div className="flex flex-wrap gap-2">
                {application.portfolio.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {item.title || item.url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {application.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleReject(application)}
                disabled={isWriting || isConfirming}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(application)}
                disabled={isWriting || isConfirming || approvingId === application._id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {approvingId === application._id && (isWriting || isConfirming)
                  ? 'Approving...'
                  : 'Approve & Assign'}
              </button>
            </div>
          )}

          {/* Applied Date */}
          <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            Applied {new Date(application.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
