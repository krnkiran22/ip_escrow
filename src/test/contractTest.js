/**
 * CONTRACT VERIFICATION TEST
 * Tests if the deployed contract is accessible and has the expected functions
 */

import './loadEnv.js';
import { createPublicClient, http, parseAbi } from 'viem';
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

async function testContract() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  CONTRACT VERIFICATION TEST           ║');
  console.log('╚═══════════════════════════════════════╝\n');

  console.log('📋 Contract Details:');
  console.log('   Address:', contractAddress);
  console.log('   Network: Story Aeneid Testnet (Chain ID: 1315)');
  console.log('   Explorer:', `https://aeneid.storyscan.xyz/address/${contractAddress}\n`);

  try {
    // Test 1: Get bytecode (check if contract exists)
    console.log('Test 1: Checking if contract exists...');
    const bytecode = await publicClient.getBytecode({ address: contractAddress });
    
    if (!bytecode || bytecode === '0x') {
      console.error('❌ No contract found at this address!');
      console.error('   The address may be incorrect or the contract is not deployed.\n');
      console.log('🔍 Please verify:');
      console.log('   1. Is the contract deployed to Story Aeneid testnet?');
      console.log('   2. Is the address in .env correct?');
      console.log('   3. Check the transaction on StoryScan');
      return;
    }
    
    console.log('✅ Contract exists! Bytecode length:', bytecode.length);
    console.log();

    // Test 2: Try to read projectCount
    console.log('Test 2: Reading projectCount()...');
    try {
      const abi = parseAbi(['function projectCount() view returns (uint256)']);
      const count = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: 'projectCount',
      });
      console.log('✅ Project Count:', count.toString());
    } catch (error) {
      console.error('❌ Failed to read projectCount:', error.message);
      console.log('   The contract may not have this function.');
    }
    console.log();

    // Test 3: Try to read owner
    console.log('Test 3: Reading owner()...');
    try {
      const abi = parseAbi(['function owner() view returns (address)']);
      const owner = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: 'owner',
      });
      console.log('✅ Contract Owner:', owner);
    } catch (error) {
      console.error('❌ Failed to read owner:', error.message);
      console.log('   The contract may not have this function.');
    }
    console.log();

    // Test 4: Check what functions the contract has
    console.log('Test 4: Analyzing contract...');
    console.log('   Bytecode size:', (bytecode.length - 2) / 2, 'bytes');
    console.log('   Contract is deployed and has code.');
    console.log();

    // Test 5: Try different function signatures
    console.log('Test 5: Testing common function signatures...');
    
    const testFunctions = [
      'function projectCount() external view returns (uint256)',
      'function projectCount() public view returns (uint256)',
      'function getProjectCount() external view returns (uint256)',
      'function totalProjects() external view returns (uint256)',
      'function numProjects() external view returns (uint256)',
    ];

    for (const funcSig of testFunctions) {
      try {
        const abi = parseAbi([funcSig]);
        const result = await publicClient.readContract({
          address: contractAddress,
          abi: abi,
          functionName: funcSig.split('(')[0].split(' ')[1],
        });
        console.log(`✅ Found: ${funcSig} = ${result.toString()}`);
      } catch (error) {
        console.log(`❌ Not found: ${funcSig}`);
      }
    }
    console.log();

    // Summary
    console.log('╔═══════════════════════════════════════╗');
    console.log('║  TEST SUMMARY                         ║');
    console.log('╚═══════════════════════════════════════╝\n');
    
    console.log('🔍 CONTRACT STATUS:');
    console.log('   ✅ Contract exists at address');
    console.log('   ✅ Contract has bytecode (deployed)');
    console.log();
    
    console.log('⚠️  NEXT STEPS:');
    console.log('   1. Verify the contract on StoryScan to see its functions');
    console.log('   2. Check if the contract ABI matches what we expect');
    console.log('   3. The contract may need to be redeployed with correct functions');
    console.log();
    
    console.log('📝 RECOMMENDED ACTIONS:');
    console.log('   1. Go to: https://aeneid.storyscan.xyz/address/' + contractAddress);
    console.log('   2. Click "Contract" tab to see verified source code');
    console.log('   3. Check what functions are actually available');
    console.log('   4. Update contractService.js with the correct ABI');
    console.log();

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run test
testContract();
