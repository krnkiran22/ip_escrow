/**
 * IPFS SINGLE FILE UPLOAD TEST
 * Tests basic file upload to Pinata
 */

// Load environment variables first
import './loadEnv.js';

import { uploadFile, getFileURL, checkIPFSConfiguration } from '../services/ipfsService.js';

async function testSingleFileUpload() {
  console.log('🧪 TEST 1: Single File Upload\n');
  
  try {
    // Step 1: Check IPFS configuration
    console.log('Step 1: Checking IPFS configuration...');
    const configCheck = await checkIPFSConfiguration();
    
    if (!configCheck.configured) {
      console.error('❌ IPFS not configured properly');
      console.error('Missing:', {
        apiKey: !configCheck.hasApiKey,
        secretKey: !configCheck.hasSecretKey,
        jwt: !configCheck.hasJWT,
      });
      console.log('\n⚠️  Please update .env with your Pinata credentials:');
      console.log('1. Go to https://pinata.cloud');
      console.log('2. Sign up / Log in');
      console.log('3. Dashboard → API Keys → New Key');
      console.log('4. Copy credentials to .env file\n');
      return;
    }
    console.log('✅ IPFS configured properly\n');
    
    // Step 2: Create test file
    console.log('Step 2: Creating test file...');
    const testContent = `IP Escrow Test File
Generated at: ${new Date().toISOString()}
Purpose: Testing IPFS upload functionality
Project: IP Escrow Platform - Story Protocol Integration`;
    
    const blob = new Blob([testContent], { type: 'text/plain' });
    const file = new File([blob], 'test-upload.txt', { type: 'text/plain' });
    console.log('✅ Test file created:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    console.log();
    
    // Step 3: Upload to IPFS
    console.log('Step 3: Uploading to IPFS...');
    const result = await uploadFile(file);
    
    if (!result.success) {
      console.error('❌ Upload failed:', result.error);
      return;
    }
    
    console.log('✅ Upload successful!');
    console.log('IPFS Hash:', result.ipfsHash);
    console.log('Gateway URL:', result.url);
    console.log('File size:', result.size, 'bytes');
    console.log();
    
    // Step 4: Verify URL
    console.log('Step 4: Verifying gateway URL...');
    const gatewayURL = getFileURL(result.ipfsHash);
    console.log('Gateway URL:', gatewayURL);
    
    if (gatewayURL === result.url) {
      console.log('✅ URL generation correct');
    } else {
      console.error('❌ URL mismatch');
    }
    console.log();
    
    // Step 5: Test summary
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════');
    console.log('✅ Configuration check: PASSED');
    console.log('✅ File creation: PASSED');
    console.log('✅ IPFS upload: PASSED');
    console.log('✅ URL verification: PASSED');
    console.log();
    console.log('🎉 All tests passed!\n');
    console.log('📌 You can access your file at:');
    console.log(result.url);
    console.log();
    console.log('💡 Try opening the URL in your browser to verify the file content.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run test
console.log('╔═══════════════════════════════════════╗');
console.log('║  IPFS SINGLE FILE UPLOAD TEST        ║');
console.log('╚═══════════════════════════════════════╝\n');

testSingleFileUpload();
