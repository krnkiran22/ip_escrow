import { useState } from 'react';
import { Upload, FileText, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import axios from 'axios';
import { uploadFile } from '../../services/ipfsService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// IPEscrow ABI
const escrowAbi = parseAbi([
  'function submitMilestone(uint256 _projectId, uint256 _index, string _ipfsHash)',
]);

export default function MilestoneSubmission({ project, milestone, onSuccess }) {
  const { address } = useAccount();
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState(null);
  
  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload file to IPFS
      toast.loading('Uploading deliverable to IPFS...');
      const ipfsResult = await uploadFile(file);
      toast.dismiss();
      
      if (!ipfsResult.success) {
        throw new Error(ipfsResult.error || 'Failed to upload to IPFS');
      }
      
      toast.success('File uploaded to IPFS');
      setIpfsHash(ipfsResult.ipfsHash);

      // Step 2: Get submission data from backend
      const response = await axios.put(`${API_URL}/milestones/${milestone._id}/submit`, {
        ipfsHash: ipfsResult.ipfsHash,
        description,
        files: [{
          name: file.name,
          ipfsHash: ipfsResult.ipfsHash,
          type: file.type,
          size: file.size
        }]
      });

      const { data } = response.data;

      // Step 3: Call smart contract
      const contractAddress = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;
      
      await writeContract({
        address: contractAddress,
        abi: escrowAbi,
        functionName: 'submitMilestone',
        args: [
          BigInt(data.contractParams.projectId),
          BigInt(data.contractParams.index),
          data.contractParams.ipfsHash
        ]
      });

    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to submit milestone');
      setIsUploading(false);
    }
  };

  // Handle confirmation
  if (isSuccess && hash && ipfsHash) {
    (async () => {
      try {
        // Step 4: Confirm in backend
        await axios.put(`${API_URL}/milestones/${milestone._id}/confirm-submission`, {
          txHash: hash,
          ipfsHash,
          description,
          files: [{
            name: file.name,
            ipfsHash,
            type: file.type,
            size: file.size
          }]
        });

        toast.success('Milestone submitted successfully!');
        setIsUploading(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Confirmation error:', error);
        toast.error('Blockchain submitted but failed to update database');
        setIsUploading(false);
      }
    })();
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        Submit Milestone {milestone.milestoneIndex + 1}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Deliverable File *
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading || isWriting || isConfirming}
            />
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Max file size: 50MB
            </p>
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileText className="w-4 h-4" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you've delivered..."
            rows={4}
            disabled={isUploading || isWriting || isConfirming}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || isUploading || isWriting || isConfirming}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(isUploading || isWriting || isConfirming) && <Loader className="w-4 h-4 animate-spin" />}
          {isUploading || isWriting || isConfirming ? 'Submitting...' : 'Submit Milestone'}
        </button>
      </form>
    </div>
  );
}
