#!/bin/bash

# Quick Diagnostic Script for IP Escrow Project Creation Issues

echo "🔍 IP ESCROW - Quick Diagnostic"
echo "================================"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this from the project root directory"
  exit 1
fi

echo "✅ In correct directory"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo "✅ Node.js: $NODE_VERSION"
else
  echo "❌ Node.js not found"
  exit 1
fi
echo ""

# Check if .env exists
echo "📄 Checking .env file..."
if [ -f ".env" ]; then
  echo "✅ .env file exists"
  
  # Check important variables
  if grep -q "VITE_IPESCROW_CONTRACT_ADDRESS" .env; then
    CONTRACT=$(grep "VITE_IPESCROW_CONTRACT_ADDRESS" .env | cut -d '=' -f2)
    echo "✅ Contract address: $CONTRACT"
  else
    echo "❌ Missing VITE_IPESCROW_CONTRACT_ADDRESS"
  fi
  
  if grep -q "VITE_PINATA_JWT" .env; then
    echo "✅ Pinata JWT configured"
  else
    echo "❌ Missing VITE_PINATA_JWT"
  fi
else
  echo "❌ .env file not found"
  exit 1
fi
echo ""

# Run comprehensive test
echo "🧪 Running contract tests..."
echo "================================"
node src/test/comprehensiveTest.js
echo ""

# Instructions
echo "================================"
echo "📋 NEXT STEPS:"
echo "================================"
echo ""
echo "1. Check the project count above"
echo "   - If 0: No projects created yet (expected)"
echo "   - If > 0: Projects exist!"
echo ""
echo "2. Check your balance above"
echo "   - Need at least 20 IP for a test project"
echo "   - Get tokens: https://faucet.story.foundation"
echo ""
echo "3. If you just tried to create a project:"
echo "   - Open browser console (F12)"
echo "   - Find the transaction hash (0x...)"
echo "   - Run: node src/test/checkTransaction.js 0xYOUR_HASH"
echo ""
echo "4. Read the debugging guide:"
echo "   - See: TRANSACTION_DEBUGGING.md"
echo ""
