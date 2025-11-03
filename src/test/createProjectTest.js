/**
 * CREATE PROJECT TEST
 * Tests creating a project on the blockchain and reading it back
 */

import './loadEnv.js';
import { createPublicClient, createWalletClient, custom, http, parseAbi, parseEther } from 'viem';
import { defineChain } from 'viem';

// Define Story Aeneid Testnet
const storyAeneid = defineChain({
  id: 1315,
  name: 'Story Aeneid Testnet',
  network: 'story-aeneid',
  nativeCurrency: { decimals: 18, name: 'IP', symbol: 'IP' },
  rpcUrls: {
    default: { http: ['https://aeneid.storyrpc.io'] },
    public: { http: ['https://aeneid.storyrpc.io'] },
  },
  blockExplorers: {
    default: { name: 'StoryScan', url: 'https://aeneid.storyscan.xyz' },
  },
  testnet: true,
});

const contractAddress = process.env.VITE_IPESCROW_CONTRACT_ADDRESS;

const publicClient = createPublicClient({
  chain: storyAeneid,
  transport: http('https://aeneid.storyrpc.io'),
});

// Contract ABI
const escrowAbi = parseAbi([
  'function createProject(string _title, string _description, uint256[] _amounts, string[] _milestoneNames) payable returns (uint256)',
  'function projectCount() view returns (uint256)',
  'function getProject(uint256 _projectId) view returns (address, address, string, uint256, uint256, uint8)',
  'function projects(uint256) view returns (address creator, address collaborator, string title, uint256 totalBudget, uint256 remainingBudget, uint8 status)',
]);

async function testCreateProject() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║  CREATE PROJECT TEST (SIMULATED)             ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  console.log('⚠️  NOTE: This is a simulation test.');
  console.log('   To actually create a project, use the frontend with MetaMask.\n');

  // Test data
  const testProject = {
    title: 'Test AI Art Project',
    description: 'Creating AI-generated artwork for NFT collection',
    milestones: [
      { name: 'Concept & Design', amount: '100' }, // 100 IP tokens
      { name: 'Development', amount: '200' },      // 200 IP tokens
      { name: 'Launch', amount: '150' },           // 150 IP tokens
    ],
  };

  const milestoneAmounts = testProject.milestones.map(m => m.amount);
  const milestoneNames = testProject.milestones.map(m => m.name);

  console.log('📋 Test Project Data:');
  console.log('   Title:', testProject.title);
  console.log('   Description:', testProject.description);
  console.log('   Milestones:', testProject.milestones.length);
  console.log();

  testProject.milestones.forEach((m, i) => {
    console.log(`   Milestone ${i + 1}: ${m.name} - ${m.amount} IP`);
  });
  console.log();

  // Calculate totals
  const amounts = milestoneAmounts.map(amount => parseEther(amount.toString()));
  const totalBudget = amounts.reduce((sum, amount) => sum + amount, 0n);
  const platformFee = (totalBudget * 2n) / 100n;
  const totalValue = totalBudget + platformFee;

  console.log('💰 Budget Calculation:');
  console.log('   Total Budget:', totalBudget.toString(), 'wei');
  console.log('   Platform Fee (2%):', platformFee.toString(), 'wei');
  console.log('   Total Value:', totalValue.toString(), 'wei');
  console.log();

  // Check current project count
  try {
    console.log('📊 Current Contract State:');
    const currentCount = await publicClient.readContract({
      address: contractAddress,
      abi: escrowAbi,
      functionName: 'projectCount',
    });
    console.log('   Project Count:', currentCount.toString());
    console.log();

    if (currentCount > 0) {
      console.log('📖 Existing Projects:');
      for (let i = 1; i <= Number(currentCount); i++) {
        try {
          // Try getProject first
          const project = await publicClient.readContract({
            address: contractAddress,
            abi: escrowAbi,
            functionName: 'getProject',
            args: [BigInt(i)],
          });
          
          console.log(`\n   Project ${i}:`);
          console.log('   - Creator:', project[0]);
          console.log('   - Collaborator:', project[1]);
          console.log('   - Title:', project[2]);
          console.log('   - Total Budget:', project[3].toString(), 'wei');
          console.log('   - Remaining Budget:', project[4].toString(), 'wei');
          console.log('   - Status:', ['Active', 'InProgress', 'Completed', 'Cancelled', 'Disputed'][project[5]]);
        } catch (error) {
          console.log(`   ❌ Failed to read project ${i}:`, error.message);
          
          // Try direct projects mapping
          try {
            const project = await publicClient.readContract({
              address: contractAddress,
              abi: escrowAbi,
              functionName: 'projects',
              args: [BigInt(i)],
            });
            
            console.log(`\n   Project ${i} (via mapping):`);
            console.log('   - Creator:', project.creator);
            console.log('   - Collaborator:', project.collaborator);
            console.log('   - Title:', project.title);
            console.log('   - Total Budget:', project.totalBudget.toString(), 'wei');
            console.log('   - Remaining Budget:', project.remainingBudget.toString(), 'wei');
            console.log('   - Status:', ['Active', 'InProgress', 'Completed', 'Cancelled', 'Disputed'][project.status]);
          } catch (err2) {
            console.log('   ❌ Also failed via mapping:', err2.message);
          }
        }
      }
    } else {
      console.log('   ℹ️  No projects created yet.');
      console.log('   This is why you see no data in Remix.');
    }
    console.log();

    // Instructions
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║  HOW TO CREATE A PROJECT                      ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    
    console.log('To actually create a project and store data on-chain:\n');
    console.log('1. Go to: http://localhost:5173/create-project');
    console.log('2. Fill out the project form');
    console.log('3. Connect your wallet (MetaMask)');
    console.log('4. Submit the project');
    console.log('5. Approve the transaction in MetaMask');
    console.log('6. Wait for confirmation');
    console.log();
    
    console.log('After creating a project:\n');
    console.log('1. Check Remix: Call projectCount() → should show 1');
    console.log('2. Call getProject(1) → should show project details');
    console.log('3. Check StoryScan:', `https://aeneid.storyscan.xyz/address/${contractAddress}`);
    console.log();
    
    console.log('⚠️  IMPORTANT:');
    console.log('   - Make sure you have test IP tokens in your wallet');
    console.log('   - The transaction requires:', totalValue.toString(), 'wei');
    console.log('   - Approve the transaction when MetaMask prompts');
    console.log();

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Details:', error.message);
  }
}

// Run test
testCreateProject();
