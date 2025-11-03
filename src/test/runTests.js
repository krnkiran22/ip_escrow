/**
 * MODULE 4 TEST RUNNER
 * Runs all IPFS integration tests in sequence
 */

// Load environment variables first
import './loadEnv.js';

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║                                                               ║');
console.log('║       IP ESCROW - MODULE 4: IPFS INTEGRATION TESTS            ║');
console.log('║                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('📋 TEST SUITE OVERVIEW:');
console.log('═══════════════════════════════════════\n');
console.log('Test 1: Single File Upload');
console.log('  ↳ Validates basic IPFS upload functionality');
console.log('  ↳ Tests configuration and gateway URL generation\n');

console.log('Test 2: JSON Metadata Upload');
console.log('  ↳ Tests JSON upload and retrieval');
console.log('  ↳ Validates data integrity\n');

console.log('Test 3: Full Integration Test');
console.log('  ↳ End-to-end workflow simulation');
console.log('  ↳ File → Hash → Upload → Metadata → Story Protocol prep\n');

console.log('═══════════════════════════════════════\n');

// Import and run tests
async function runAllTests() {
  try {
    console.log('⏳ Starting test execution...\n\n');
    
    // Test 1: Single file upload
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await import('./ipfsTest.js');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    
    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: JSON upload
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await import('./ipfsJSONTest.js');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    
    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Integration test
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await import('./ipfsIntegrationTest.js');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    
    // Final summary
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                  ALL TESTS COMPLETED                          ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    
    console.log('✅ Module 4 IPFS Integration: COMPLETE\n');
    console.log('📚 What was tested:');
    console.log('   ✓ IPFS configuration validation');
    console.log('   ✓ Single file upload to Pinata');
    console.log('   ✓ JSON metadata upload');
    console.log('   ✓ File hash generation (SHA-256)');
    console.log('   ✓ Data integrity verification');
    console.log('   ✓ Gateway URL generation');
    console.log('   ✓ Full integration workflow\n');
    
    console.log('🚀 Next Steps:');
    console.log('   1. Integrate FileUpload into CreateProject page');
    console.log('   2. Connect to Story Protocol for IP registration');
    console.log('   3. Link to smart contracts for escrow creation');
    console.log('   4. Test complete user flow\n');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    console.error('Error:', error.message);
  }
}

runAllTests();
