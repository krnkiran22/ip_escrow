#!/bin/bash

# IP Escrow Backend - Installation Script
# This script helps set up the backend environment

set -e  # Exit on error

echo "🚀 IP Escrow Backend Setup"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check npm
echo "📦 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# Check MongoDB
echo "📦 Checking MongoDB..."
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB CLI not found${NC}"
    echo "Please ensure MongoDB is installed and running"
    echo "macOS: brew install mongodb-community"
    echo "Or use Docker: docker run -d -p 27017:27017 mongo:latest"
else
    echo -e "${GREEN}✅ MongoDB CLI found${NC}"
fi

echo ""
echo "🔧 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo "📝 Setting up environment..."

# Check if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file"
    else
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
fi

echo ""
echo "⚙️  Please configure the following in your .env file:"
echo ""
echo "   1. JWT_SECRET - Generate a random secret key"
echo "   2. PRIVATE_KEY - Your backend wallet private key"
echo "   3. PROJECT_FACTORY_ADDRESS - Your deployed contract address"
echo "   4. IPFS_JWT - Your Pinata JWT token"
echo "   5. MONGODB_URI - MongoDB connection string (default: mongodb://localhost:27017/ip_escrow)"
echo ""

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your configuration"
echo "  2. Ensure MongoDB is running"
echo "  3. Run: npm run dev"
echo ""
echo "Documentation:"
echo "  - README.md - Full documentation"
echo "  - QUICKSTART.md - Quick start guide"
echo "  - IMPLEMENTATION_SUMMARY.md - What's been built"
echo ""
