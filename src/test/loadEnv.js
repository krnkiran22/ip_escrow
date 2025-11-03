/**
 * Load environment variables for Node.js tests
 * Reads .env file and sets process.env variables
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file from project root
const envPath = join(__dirname, '../../.env');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  
  // Parse .env file
  envFile.split('\n').forEach(line => {
    // Skip empty lines and comments
    if (!line || line.trim().startsWith('#')) return;
    
    // Parse KEY=VALUE
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Set in process.env
      process.env[key] = value;
    }
  });
  
  console.log('✅ Environment variables loaded from .env\n');
} catch (error) {
  console.error('⚠️  Could not load .env file:', error.message);
  console.error('   Make sure .env file exists in project root\n');
}
