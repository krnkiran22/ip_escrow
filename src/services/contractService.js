import { createPublicClient, createWalletClient, custom, http, parseAbi, parseEther } from 'viem';
import { defineChain } from 'viem';
import toast from 'react-hot-toast';

// Support both Node.js (process.env) and Vite (import.meta.env)
const getEnv = (key) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  return undefined;
};

// Define Story Aeneid Testnet
const storyAeneid = defineChain({
  id: 1315,
  name: 'Story Aeneid Testnet',
  network: 'story-aeneid',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: { name: 'StoryScan', url: 'https://aeneid.storyscan.xyz' },
  },
  testnet: true,
});

const contractAddress = getEnv('VITE_IPESCROW_CONTRACT_ADDRESS');
const revenueVaultAddress = getEnv('VITE_REVENUE_VAULT_CONTRACT_ADDRESS');

// Public client for reading
const publicClient = createPublicClient({
  chain: storyAeneid,
  transport: http('https://aeneid.storyrpc.io'),
});

// Get wallet client
const getWalletClient = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not found. Please install MetaMask to continue.');
  }
  
  const walletClient = createWalletClient({
    chain: storyAeneid,
    transport: custom(window.ethereum),
  });
  
  const [address] = await walletClient.getAddresses();
  
  if (!address) {
    throw new Error('No wallet address found. Please connect your wallet.');
  }
  
  return { walletClient, address };
};

// IPEscrow Contract ABI (simplified for testing)
const escrowAbi = parseAbi([
  'function createProject(string _title, string _description, uint256[] _amounts, string[] _milestoneNames) payable returns (uint256)',
  'function projectCount() view returns (uint256)',
  'function getProject(uint256 _projectId) view returns (address, address, string, uint256, uint256, uint8)',
  'function approveCollaborator(uint256 _projectId, address _collaborator)',
  'function submitMilestone(uint256 _projectId, uint256 _index, string _ipfsHash)',
  'function approveMilestone(uint256 _projectId, uint256 _index)',
  'function rejectMilestone(uint256 _projectId, uint256 _index, string _reason)',
  'function cancelProject(uint256 _projectId)',
  'function raiseDispute(uint256 _projectId, string _reason)',
  'function resolveDispute(uint256 _projectId, bool _favorCreator)',
  'function owner() view returns (address)',
  'function platformFeePercent() view returns (uint256)',
]);

/**
 * CREATE PROJECT ON BLOCKCHAIN
 * @param {string} title - Project title
 * @param {string} description - Project description
 * @param {Array<number>} milestoneAmounts - Array of milestone amounts in IP tokens
 * @param {Array<string>} milestoneNames - Array of milestone names
 * @param {string} ipfsHash - IPFS hash of project metadata
 * @returns {Promise<object>} - { success, projectId, txHash }
 */
export async function createProjectOnChain(title, description, milestoneAmounts, milestoneNames, ipfsHash) {
  try {
    console.log('🚀 Creating project on blockchain...');
    
    const { walletClient, address } = await getWalletClient();
    
    // Convert amounts to BigInt (wei)
    const amounts = milestoneAmounts.map(amount => parseEther(amount.toString()));
    
    // Calculate total budget
    const totalBudget = amounts.reduce((sum, amount) => sum + amount, 0n);
    
    // Add 2% platform fee
    const platformFee = (totalBudget * 2n) / 100n;
    const totalValue = totalBudget + platformFee;
    
    console.log('Project details:', {
      title,
      description,
      milestones: milestoneNames.length,
      totalBudget: totalBudget.toString(),
      platformFee: platformFee.toString(),
      totalValue: totalValue.toString(),
    });
    
    toast.loading('Waiting for transaction approval...', { id: 'create-project' });
    
    // Call smart contract
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'createProject',
      args: [title, description, amounts, milestoneNames],
      value: totalValue,
      account: address,
    });
    
    console.log('✅ Transaction sent:', hash);
    toast.loading('Transaction submitted. Waiting for confirmation...', { id: 'create-project' });
    
    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash,
      confirmations: 1,
    });
    
    console.log('✅ Transaction confirmed:', receipt);
    
    // Read project count to get new project ID
    const projectCount = await publicClient.readContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'projectCount',
    });
    
    const projectId = projectCount.toString();
    
    toast.success(`Project created successfully! ID: ${projectId}`, { id: 'create-project' });
    
    return {
      success: true,
      projectId,
      txHash: hash,
      receipt,
    };
  } catch (error) {
    console.error('❌ Project creation failed:', error);
    
    let errorMessage = 'Failed to create project';
    if (error.message.includes('User rejected')) {
      errorMessage = 'Transaction rejected by user';
    } else if (error.message.includes('insufficient funds')) {
      errorMessage = 'Insufficient funds for transaction';
    }
    
    toast.error(errorMessage, { id: 'create-project' });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * GET PROJECT COUNT
 * @returns {Promise<number>} - Total number of projects
 */
export async function getProjectCount() {
  try {
    const count = await publicClient.readContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'projectCount',
    });
    
    return Number(count);
  } catch (error) {
    console.error('❌ Failed to get project count:', error);
    return 0;
  }
}

/**
 * GET PROJECT DETAILS
 * @param {number|string} projectId - Project ID
 * @returns {Promise<object>} - Project details
 */
export async function getProjectDetails(projectId) {
  try {
    const project = await publicClient.readContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'getProject',
      args: [BigInt(projectId)],
    });
    
    const [creator, collaborator, title, totalBudget, remainingBudget, status] = project;
    
    return {
      success: true,
      creator,
      collaborator,
      title,
      totalBudget: totalBudget.toString(),
      remainingBudget: remainingBudget.toString(),
      status: Number(status), // 0=Active, 1=InProgress, 2=Completed, 3=Cancelled, 4=Disputed
      statusText: ['Active', 'In Progress', 'Completed', 'Cancelled', 'Disputed'][Number(status)],
    };
  } catch (error) {
    console.error('❌ Failed to get project details:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * GET PROJECT MILESTONES
 * @param {number|string} projectId - Project ID
 * @returns {Promise<Array>} - Array of milestones
 * 
 * TODO: Fix ABI for complex tuple return type
 */
/* export async function getProjectMilestones(projectId) {
  try {
    const milestones = await publicClient.readContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'getMilestones',
      args: [BigInt(projectId)],
    });
    
    return {
      success: true,
      milestones: milestones.map((m, index) => ({
        index,
        name: m.name,
        amount: m.amount.toString(),
        completed: m.completed,
        ipfsHash: m.ipfsHash,
        submitter: m.submitter,
        approved: m.approved,
      })),
    };
  } catch (error) {
    console.error('❌ Failed to get milestones:', error);
    return {
      success: false,
      error: error.message,
    };
  }
} */

/**
 * APPROVE COLLABORATOR
 * @param {number|string} projectId - Project ID
 * @param {string} collaboratorAddress - Collaborator wallet address
 * @returns {Promise<object>} - { success, txHash }
 */
export async function approveCollaborator(projectId, collaboratorAddress) {
  try {
    console.log('👥 Approving collaborator...');
    
    const { walletClient, address } = await getWalletClient();
    
    toast.loading('Waiting for transaction approval...', { id: 'approve-collab' });
    
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'approveCollaborator',
      args: [BigInt(projectId), collaboratorAddress],
      account: address,
    });
    
    console.log('✅ Transaction sent:', hash);
    toast.loading('Waiting for confirmation...', { id: 'approve-collab' });
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    console.log('✅ Collaborator approved');
    toast.success('Collaborator approved successfully!', { id: 'approve-collab' });
    
    return {
      success: true,
      txHash: hash,
      receipt,
    };
  } catch (error) {
    console.error('❌ Approval failed:', error);
    toast.error('Failed to approve collaborator', { id: 'approve-collab' });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * SUBMIT MILESTONE
 * @param {number|string} projectId - Project ID
 * @param {number} milestoneIndex - Milestone index
 * @param {string} ipfsHash - IPFS hash of deliverable
 * @returns {Promise<object>} - { success, txHash }
 */
export async function submitMilestone(projectId, milestoneIndex, ipfsHash) {
  try {
    console.log('📤 Submitting milestone...');
    
    const { walletClient, address } = await getWalletClient();
    
    toast.loading('Waiting for transaction approval...', { id: 'submit-milestone' });
    
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'submitMilestone',
      args: [BigInt(projectId), BigInt(milestoneIndex), ipfsHash],
      account: address,
    });
    
    console.log('✅ Transaction sent:', hash);
    toast.loading('Waiting for confirmation...', { id: 'submit-milestone' });
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    console.log('✅ Milestone submitted');
    toast.success('Milestone submitted for review!', { id: 'submit-milestone' });
    
    return {
      success: true,
      txHash: hash,
      receipt,
    };
  } catch (error) {
    console.error('❌ Submission failed:', error);
    toast.error('Failed to submit milestone', { id: 'submit-milestone' });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * APPROVE MILESTONE
 * @param {number|string} projectId - Project ID
 * @param {number} milestoneIndex - Milestone index
 * @returns {Promise<object>} - { success, txHash }
 */
export async function approveMilestone(projectId, milestoneIndex) {
  try {
    console.log('✅ Approving milestone...');
    
    const { walletClient, address } = await getWalletClient();
    
    toast.loading('Waiting for transaction approval...', { id: 'approve-milestone' });
    
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'approveMilestone',
      args: [BigInt(projectId), BigInt(milestoneIndex)],
      account: address,
    });
    
    console.log('✅ Transaction sent:', hash);
    toast.loading('Releasing payment...', { id: 'approve-milestone' });
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    console.log('✅ Milestone approved and payment released');
    toast.success('Milestone approved! Payment released.', { id: 'approve-milestone' });
    
    return {
      success: true,
      txHash: hash,
      receipt,
    };
  } catch (error) {
    console.error('❌ Approval failed:', error);
    toast.error('Failed to approve milestone', { id: 'approve-milestone' });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * TEST CONTRACT CONNECTION
 * @returns {Promise<boolean>} - Connection status
 */
export async function testContractConnection() {
  try {
    console.log('🔍 Testing contract connection...');
    console.log('Contract address:', contractAddress);
    
    // Test 1: Read owner
    const owner = await publicClient.readContract({
      address: contractAddress,
      abi: parseAbi(['function owner() view returns (address)']),
      functionName: 'owner',
    });
    console.log('✅ Contract owner:', owner);
    
    // Test 2: Read project count
    const count = await publicClient.readContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'projectCount',
    });
    console.log('✅ Project count:', count.toString());
    
    // Test 3: Read platform fee
    const fee = await publicClient.readContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'platformFeePercent',
    });
    console.log('✅ Platform fee:', fee.toString(), '%');
    
    console.log('🎉 Contract connection test passed!');
    return true;
  } catch (error) {
    console.error('❌ Contract connection test failed:', error);
    return false;
  }
}

export default {
  createProjectOnChain,
  getProjectCount,
  getProjectDetails,
  // getProjectMilestones, // TODO: Fix ABI tuple syntax
  approveCollaborator,
  submitMilestone,
  approveMilestone,
  testContractConnection,
};
