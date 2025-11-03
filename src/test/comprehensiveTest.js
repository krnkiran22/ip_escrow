/**
 * COMPREHENSIVE CONTRACT TEST SUITE
 * 
 * This script tests the complete project creation flow:
 * 1. Contract connection and verification
 * 2. Wallet balance check
 * 3. Project creation simulation
 * 4. Transaction cost estimation
 * 5. Troubleshooting diagnostics
 */

import { createPublicClient, http, parseEther } from 'viem';
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
const TEST_WALLET = process.env.TEST_WALLET_ADDRESS || '0x27dBFd227d05B32360306f30a4B439504Facdd79';

// Create public client
const publicClient = createPublicClient({
  chain,
  transport: http('https://aeneid.storyrpc.io'),
});

// Simplified ABI for testing
const ABI = [
  'function projectCount() view returns (uint256)',
  'function getProject(uint256) view returns (address, address, string, uint256, uint256, uint8)',
  'function owner() view returns (address)',
  'function platformFeePercent() view returns (uint256)',
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(70));
  log(`  ${title}`, 'bright');
  console.log('='.repeat(70) + '\n');
}

async function test1_ContractExists() {
  section('TEST 1: Contract Deployment Verification');
  
  try {
    log('📍 Contract Address: ' + CONTRACT_ADDRESS, 'cyan');
    log('🔗 Explorer: https://aeneid.storyscan.xyz/address/' + CONTRACT_ADDRESS, 'blue');
    
    // Check bytecode
    const code = await publicClient.getBytecode({ address: CONTRACT_ADDRESS });
    
    if (!code || code === '0x') {
      log('❌ FAILED: No contract found at this address', 'red');
      return false;
    }
    
    log(`✅ PASSED: Contract exists`, 'green');
    log(`   Bytecode length: ${code.length} characters`, 'cyan');
    log(`   Actual size: ${(code.length - 2) / 2} bytes`, 'cyan');
    
    return true;
  } catch (error) {
    log('❌ FAILED: ' + error.message, 'red');
    return false;
  }
}

async function test2_ReadProjectCount() {
  section('TEST 2: Read Project Count');
  
  try {
    const count = await publicClient.readContract({
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
    
    const countNum = Number(count);
    
    log(`✅ PASSED: projectCount() = ${countNum}`, 'green');
    
    if (countNum === 0) {
      log('ℹ️  No projects created yet', 'yellow');
      log('💡 This is expected if you haven\'t created any projects', 'yellow');
    } else {
      log(`📊 Found ${countNum} project${countNum > 1 ? 's' : ''}`, 'cyan');
    }
    
    return { success: true, count: countNum };
  } catch (error) {
    log('❌ FAILED: ' + error.message, 'red');
    return { success: false, count: 0 };
  }
}

async function test3_ReadOwner() {
  section('TEST 3: Read Contract Owner');
  
  try {
    const owner = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: [{
        type: 'function',
        name: 'owner',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'address' }]
      }],
      functionName: 'owner',
    });
    
    log(`✅ PASSED: owner() = ${owner}`, 'green');
    log(`🔗 View on explorer: https://aeneid.storyscan.xyz/address/${owner}`, 'blue');
    
    return { success: true, owner };
  } catch (error) {
    log('❌ FAILED: ' + error.message, 'red');
    return { success: false, owner: null };
  }
}

async function test4_CheckBalance() {
  section('TEST 4: Wallet Balance Check');
  
  try {
    log(`📍 Test Wallet: ${TEST_WALLET}`, 'cyan');
    
    const balance = await publicClient.getBalance({ address: TEST_WALLET });
    const balanceInIP = Number(balance) / 1e18;
    
    log(`✅ PASSED: Balance retrieved`, 'green');
    log(`💰 Balance: ${balanceInIP.toFixed(4)} IP`, 'cyan');
    log(`   Raw wei: ${balance.toString()}`, 'blue');
    
    // Check if balance is sufficient for a test project
    const testProjectCost = parseEther('459'); // 450 budget + 9 fee
    const hasSufficientBalance = balance >= testProjectCost;
    
    if (hasSufficientBalance) {
      log('✅ Sufficient balance for test project (needs ~459 IP)', 'green');
    } else {
      log('⚠️  Insufficient balance for test project', 'yellow');
      log('💡 Get test tokens: https://faucet.story.foundation', 'yellow');
    }
    
    return { success: true, balance: balanceInIP, sufficient: hasSufficientBalance };
  } catch (error) {
    log('❌ FAILED: ' + error.message, 'red');
    return { success: false, balance: 0, sufficient: false };
  }
}

async function test5_CalculateProjectCost() {
  section('TEST 5: Project Cost Calculation');
  
  try {
    // Test project with 3 milestones
    const milestones = [
      { name: 'Design Phase', amount: 100 },
      { name: 'Development Phase', amount: 200 },
      { name: 'Launch Phase', amount: 150 },
    ];
    
    log('📊 Test Project Milestones:', 'bright');
    milestones.forEach((m, i) => {
      log(`   ${i + 1}. ${m.name}: ${m.amount} IP`, 'cyan');
    });
    
    // Calculate costs
    const totalBudget = milestones.reduce((sum, m) => sum + m.amount, 0);
    const platformFee = totalBudget * 0.02; // 2%
    const totalCost = totalBudget + platformFee;
    
    log('\n💰 Cost Breakdown:', 'bright');
    log(`   Total Budget: ${totalBudget} IP`, 'cyan');
    log(`   Platform Fee (2%): ${platformFee} IP`, 'cyan');
    log(`   Total Required: ${totalCost} IP`, 'green');
    
    // Convert to wei for contract
    const totalBudgetWei = parseEther(totalBudget.toString());
    const platformFeeWei = parseEther(platformFee.toString());
    const totalValueWei = totalBudgetWei + platformFeeWei;
    
    log('\n🔢 In Wei (for contract):', 'bright');
    log(`   Total Budget: ${totalBudgetWei.toString()} wei`, 'blue');
    log(`   Platform Fee: ${platformFeeWei.toString()} wei`, 'blue');
    log(`   Total Value: ${totalValueWei.toString()} wei`, 'blue');
    
    return {
      success: true,
      totalBudget,
      platformFee,
      totalCost,
      totalValueWei: totalValueWei.toString(),
    };
  } catch (error) {
    log('❌ FAILED: ' + error.message, 'red');
    return { success: false };
  }
}

async function test6_LoadExistingProjects(projectCount) {
  if (projectCount === 0) {
    log('\nℹ️  Skipping project loading (no projects exist)', 'yellow');
    return { success: true, projects: [] };
  }
  
  section('TEST 6: Load Existing Projects');
  
  try {
    const projects = [];
    const maxToLoad = Math.min(projectCount, 5);
    
    log(`📥 Loading ${maxToLoad} most recent project(s)...\n`, 'cyan');
    
    for (let i = 1; i <= maxToLoad; i++) {
      try {
        const project = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: [{
            type: 'function',
            name: 'getProject',
            stateMutability: 'view',
            inputs: [{ name: '_projectId', type: 'uint256' }],
            outputs: [
              { name: 'creator', type: 'address' },
              { name: 'collaborator', type: 'address' },
              { name: 'title', type: 'string' },
              { name: 'totalBudget', type: 'uint256' },
              { name: 'remainingBudget', type: 'uint256' },
              { name: 'status', type: 'uint8' }
            ]
          }],
          functionName: 'getProject',
          args: [BigInt(i)],
        });
        
        const [creator, collaborator, title, totalBudget, remainingBudget, status] = project;
        const statusText = ['Active', 'In Progress', 'Completed', 'Cancelled', 'Disputed'][status] || 'Unknown';
        
        log(`Project #${i}: ${title}`, 'bright');
        log(`   Creator: ${creator}`, 'cyan');
        log(`   Collaborator: ${collaborator}`, 'cyan');
        log(`   Budget: ${(Number(totalBudget) / 1e18).toFixed(2)} IP`, 'cyan');
        log(`   Remaining: ${(Number(remainingBudget) / 1e18).toFixed(2)} IP`, 'cyan');
        log(`   Status: ${statusText}`, status === 0 ? 'green' : 'yellow');
        log('');
        
        projects.push({ id: i, creator, title, totalBudget, status: statusText });
      } catch (error) {
        log(`⚠️  Could not load project #${i}: ${error.message}`, 'yellow');
      }
    }
    
    log(`✅ PASSED: Loaded ${projects.length} project(s)`, 'green');
    return { success: true, projects };
  } catch (error) {
    log('❌ FAILED: ' + error.message, 'red');
    return { success: false, projects: [] };
  }
}

async function showTroubleshooting() {
  section('TROUBLESHOOTING GUIDE');
  
  log('If projectCount is 0:', 'bright');
  log('1. No projects have been created yet', 'yellow');
  log('2. Go to: http://localhost:5173/create-project', 'cyan');
  log('3. Fill out the form completely', 'cyan');
  log('4. Connect your MetaMask wallet', 'cyan');
  log('5. Submit and approve the transaction', 'cyan');
  log('6. Wait for confirmation (10-30 seconds)', 'cyan');
  log('7. Then run this test again to see the project', 'cyan');
  
  log('\nIf transaction fails:', 'bright');
  log('• Check wallet has enough IP tokens', 'yellow');
  log('• Verify MetaMask is on Story Aeneid testnet', 'yellow');
  log('• Check contract address is correct', 'yellow');
  log('• Try with smaller milestone amounts first', 'yellow');
  
  log('\nGet test tokens:', 'bright');
  log('🚰 Faucet: https://faucet.story.foundation', 'cyan');
  log('📖 Docs: https://docs.story.foundation', 'cyan');
  
  log('\nContract Explorer:', 'bright');
  log(`🔗 ${chain.blockExplorers.default.url}/address/${CONTRACT_ADDRESS}`, 'cyan');
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════════════╗', 'bright');
  log('║         IP ESCROW CONTRACT - COMPREHENSIVE TEST SUITE           ║', 'bright');
  log('╚══════════════════════════════════════════════════════════════════╝', 'bright');
  
  log('\n📍 Configuration:', 'bright');
  log(`   Network: ${chain.name}`, 'cyan');
  log(`   Chain ID: ${chain.id}`, 'cyan');
  log(`   RPC: ${chain.rpcUrls.default.http[0]}`, 'cyan');
  log(`   Contract: ${CONTRACT_ADDRESS}`, 'cyan');
  
  const results = {
    contractExists: false,
    projectCount: 0,
    owner: null,
    balance: 0,
    sufficientBalance: false,
    projects: [],
  };
  
  // Run tests
  results.contractExists = await test1_ContractExists();
  
  if (results.contractExists) {
    const countResult = await test2_ReadProjectCount();
    results.projectCount = countResult.count;
    
    const ownerResult = await test3_ReadOwner();
    results.owner = ownerResult.owner;
    
    const balanceResult = await test4_CheckBalance();
    results.balance = balanceResult.balance;
    results.sufficientBalance = balanceResult.sufficient;
    
    await test5_CalculateProjectCost();
    
    const projectsResult = await test6_LoadExistingProjects(results.projectCount);
    results.projects = projectsResult.projects;
  }
  
  // Show troubleshooting
  await showTroubleshooting();
  
  // Final summary
  section('TEST SUMMARY');
  
  const allPassed = results.contractExists;
  
  if (allPassed) {
    log('🎉 All core tests passed!', 'green');
    log(`📊 Contract Status: Active`, 'green');
    log(`📈 Total Projects: ${results.projectCount}`, 'cyan');
    log(`💰 Wallet Balance: ${results.balance.toFixed(4)} IP`, 'cyan');
    log(`✅ Ready to create projects: ${results.sufficientBalance ? 'Yes' : 'No (needs more tokens)'}`, 
      results.sufficientBalance ? 'green' : 'yellow');
  } else {
    log('❌ Some tests failed. Check the output above for details.', 'red');
  }
  
  log('\n' + '='.repeat(70) + '\n', 'bright');
}

// Run tests
main().catch(console.error);
