/**
 * CHECK TRANSACTION STATUS
 * 
 * This script checks if a transaction succeeded and why it might have failed
 */

import { createPublicClient, http } from 'viem';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../../.env') });

// Story Aeneid Testnet configuration
const chain = {
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
};

const CONTRACT_ADDRESS = process.env.VITE_IPESCROW_CONTRACT_ADDRESS;

// Create public client
const publicClient = createPublicClient({
  chain,
  transport: http('https://aeneid.storyrpc.io'),
});

// Get transaction hash from command line or use default
const txHash = process.argv[2];

if (!txHash) {
  console.log('❌ Please provide a transaction hash');
  console.log('Usage: node src/test/checkTransaction.js 0x...');
  console.log('\nExample:');
  console.log('  node src/test/checkTransaction.js 0x1234567890abcdef...');
  process.exit(1);
}

async function checkTransaction() {
  console.log('\n🔍 Checking Transaction\n');
  console.log('═'.repeat(70));
  console.log('Transaction Hash:', txHash);
  console.log('═'.repeat(70) + '\n');
  
  try {
    // Get transaction details
    console.log('📥 Fetching transaction details...\n');
    const tx = await publicClient.getTransaction({ hash: txHash });
    
    console.log('Transaction Details:');
    console.log('  From:', tx.from);
    console.log('  To:', tx.to);
    console.log('  Value:', tx.value.toString(), 'wei');
    console.log('  Value in IP:', (Number(tx.value) / 1e18).toFixed(4), 'IP');
    console.log('  Gas:', tx.gas.toString());
    console.log('  Gas Price:', tx.gasPrice.toString(), 'wei');
    console.log('  Block:', tx.blockNumber);
    console.log('  Nonce:', tx.nonce);
    
    // Check if it's to our contract
    if (tx.to.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
      console.log('\n⚠️  WARNING: Transaction is NOT to the IPEscrow contract!');
      console.log('  Expected:', CONTRACT_ADDRESS);
      console.log('  Actual:', tx.to);
    } else {
      console.log('\n✅ Transaction is to the correct contract');
    }
    
    // Get transaction receipt
    console.log('\n📥 Fetching transaction receipt...\n');
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    
    console.log('Transaction Receipt:');
    console.log('  Status:', receipt.status);
    console.log('  Block Number:', receipt.blockNumber);
    console.log('  Gas Used:', receipt.gasUsed.toString());
    console.log('  Effective Gas Price:', receipt.effectiveGasPrice.toString());
    console.log('  Cumulative Gas Used:', receipt.cumulativeGasUsed.toString());
    
    // Check status
    if (receipt.status === 'success') {
      console.log('\n✅ Transaction was SUCCESSFUL');
    } else if (receipt.status === 'reverted') {
      console.log('\n❌ Transaction REVERTED');
      console.log('   The transaction was included in a block but failed execution.');
      console.log('   Common reasons:');
      console.log('   - Insufficient value sent');
      console.log('   - Contract requirements not met');
      console.log('   - Contract has a bug');
    } else {
      console.log('\n⚠️  Unknown status:', receipt.status);
    }
    
    // Check logs/events
    if (receipt.logs && receipt.logs.length > 0) {
      console.log('\n📋 Transaction Logs:');
      console.log(`   ${receipt.logs.length} event(s) emitted`);
      receipt.logs.forEach((log, i) => {
        console.log(`   Event ${i + 1}:`);
        console.log('     Address:', log.address);
        console.log('     Topics:', log.topics.length);
        console.log('     Data:', log.data.substring(0, 66) + '...');
      });
    } else {
      console.log('\n⚠️  No events emitted');
      console.log('   This might indicate the transaction reverted');
    }
    
    // Now check project count
    console.log('\n📊 Checking Project Count...\n');
    const projectCount = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: [{
        type: 'function',
        name: 'projectCount',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }]
      }],
      functionName: 'projectCount',
    });
    
    console.log('Current Project Count:', Number(projectCount));
    
    if (Number(projectCount) === 0) {
      console.log('\n❌ PROBLEM IDENTIFIED:');
      console.log('   Transaction was confirmed BUT project count is still 0');
      console.log('   This means the transaction likely REVERTED');
      console.log('\n   Possible causes:');
      console.log('   1. Insufficient value sent with transaction');
      console.log('      - Check if value sent matches (budget + 2% fee)');
      console.log('   2. One of the require() statements in the contract failed');
      console.log('   3. Arrays length mismatch (amounts vs milestone names)');
      console.log('   4. Milestone amounts are zero or invalid');
      console.log('\n   To debug:');
      console.log('   - Check browser console for full error message');
      console.log('   - Verify the contract function parameters');
      console.log('   - Try with very small amounts first (1-5 IP per milestone)');
    } else {
      console.log('\n✅ SUCCESS:');
      console.log('   Project was created successfully!');
      console.log(`   Project ID: ${Number(projectCount)}`);
    }
    
    // Show explorer link
    console.log('\n🔗 View on Explorer:');
    console.log(`   https://aeneid.storyscan.xyz/tx/${txHash}`);
    
  } catch (error) {
    console.error('\n❌ Error checking transaction:', error.message);
    console.error('\nFull error:', error);
  }
}

checkTransaction();
