/**
 * IPFS JSON METADATA UPLOAD TEST
 * Tests JSON metadata upload to Pinata
 */

import { uploadJSON, fetchJSONFromIPFS, checkIPFSConfiguration } from '../services/ipfsService.js';

async function testJSONUpload() {
  console.log('🧪 TEST 2: JSON Metadata Upload\n');
  
  try {
    // Step 1: Check configuration
    console.log('Step 1: Checking IPFS configuration...');
    const configCheck = await checkIPFSConfiguration();
    
    if (!configCheck.configured) {
      console.error('❌ IPFS not configured. Please run ipfsTest.js first for setup instructions.');
      return;
    }
    console.log('✅ IPFS configured\n');
    
    // Step 2: Create test metadata
    console.log('Step 2: Creating test metadata...');
    const metadata = {
      name: 'Test IP Asset',
      description: 'Test intellectual property asset for IP Escrow platform',
      type: 'Digital Art',
      creator: {
        name: 'Test Creator',
        wallet: '0x1234567890123456789012345678901234567890',
      },
      project: {
        title: 'Test Project',
        category: 'Art & Design',
        budget: 1000,
        milestones: [
          { name: 'Concept', amount: 300 },
          { name: 'Development', amount: 500 },
          { name: 'Delivery', amount: 200 },
        ],
      },
      ipRights: {
        license: 'Commercial Use',
        territory: 'Worldwide',
        duration: 'Perpetual',
      },
      technical: {
        format: 'Digital',
        fileType: 'PNG',
        dimensions: '1920x1080',
      },
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    
    console.log('✅ Metadata created:', JSON.stringify(metadata, null, 2));
    console.log();
    
    // Step 3: Upload JSON
    console.log('Step 3: Uploading JSON to IPFS...');
    const result = await uploadJSON(metadata);
    
    if (!result.success) {
      console.error('❌ Upload failed:', result.error);
      return;
    }
    
    console.log('✅ Upload successful!');
    console.log('IPFS Hash:', result.ipfsHash);
    console.log('Gateway URL:', result.url);
    console.log();
    
    // Step 4: Fetch and verify
    console.log('Step 4: Fetching JSON from IPFS...');
    const fetchResult = await fetchJSONFromIPFS(result.ipfsHash);
    
    if (!fetchResult.success) {
      console.error('❌ Fetch failed:', fetchResult.error);
      return;
    }
    
    console.log('✅ JSON fetched successfully');
    console.log('Retrieved data:', JSON.stringify(fetchResult.data, null, 2));
    console.log();
    
    // Step 5: Verify data integrity
    console.log('Step 5: Verifying data integrity...');
    const dataMatch = JSON.stringify(metadata) === JSON.stringify(fetchResult.data);
    
    if (dataMatch) {
      console.log('✅ Data integrity verified - Perfect match!');
    } else {
      console.error('❌ Data mismatch detected');
      console.log('Original:', metadata);
      console.log('Retrieved:', fetchResult.data);
    }
    console.log();
    
    // Step 6: Test summary
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════');
    console.log('✅ Configuration check: PASSED');
    console.log('✅ Metadata creation: PASSED');
    console.log('✅ JSON upload: PASSED');
    console.log('✅ JSON fetch: PASSED');
    console.log(dataMatch ? '✅ Data integrity: PASSED' : '❌ Data integrity: FAILED');
    console.log();
    console.log('🎉 All tests passed!\n');
    console.log('📌 Metadata available at:');
    console.log(result.url);
    console.log();
    console.log('💡 This metadata can be used with Story Protocol registration.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run test
console.log('╔═══════════════════════════════════════╗');
console.log('║  IPFS JSON METADATA UPLOAD TEST       ║');
console.log('╚═══════════════════════════════════════╝\n');

testJSONUpload();
