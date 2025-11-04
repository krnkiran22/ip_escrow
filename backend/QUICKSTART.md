# IP Escrow Backend - Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ MongoDB installed and running
- ✅ Story Network wallet with testnet IP tokens
- ✅ Pinata account and JWT token
- ✅ Your deployed smart contract address

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages including:

- express (web framework)
- mongoose (MongoDB ODM)
- ethers (blockchain interaction)
- jsonwebtoken (authentication)
- And 20+ other dependencies

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in these **REQUIRED** fields:

```env
# CRITICAL: Change these values!
JWT_SECRET=generate-a-random-secret-here
PRIVATE_KEY=your-backend-wallet-private-key-here
PROJECT_FACTORY_ADDRESS=0x701dca87b35B0e65Ba8bE229878FDdA3887952b8
IPFS_JWT=your-pinata-jwt-token-here
```

**⚠️ IMPORTANT:**

- Never commit your `.env` file
- Keep your `PRIVATE_KEY` secret
- Use a dedicated wallet for backend transactions

### 3. Start MongoDB

**Option A: Local MongoDB**

```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Check if running
mongosh
```

**Option B: Docker**

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

### 4. Start the Backend

**Development mode (recommended):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see:

```
✅ Database connected
✅ Blockchain connection initialized
✅ Contract service initialized
✅ IPFS service initialized
✅ Event listener started
🚀 Server running on port 5000
```

### 5. Test the API

**Health check:**

```bash
curl http://localhost:5000/health
```

**Connect wallet:**

```bash
curl -X POST http://localhost:5000/api/auth/connect \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0xYourWalletAddress"}'
```

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/ip_escrow
```

### Blockchain Connection Failed

**Error:** `Failed to initialize blockchain connection`

**Solution:**

- Check `STORY_RPC_URL` in `.env`
- Verify Story Network is accessible
- Test RPC manually: `curl https://testnet.storyrpc.io`

### IPFS Upload Failed

**Error:** `IPFS operation failed`

**Solution:**

- Verify `IPFS_JWT` token in `.env`
- Check Pinata account is active
- Test Pinata API: https://app.pinata.cloud/developers/api-keys

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

## 📝 Next Steps

1. **Frontend Integration**: Update frontend to use `http://localhost:5000/api`
2. **Test Authentication**: Connect wallet from frontend
3. **Create a Project**: Test project creation flow
4. **Monitor Events**: Watch console for blockchain events
5. **Check Database**: Use MongoDB Compass or mongosh to view data

## 🔧 Development Tools

### View Logs

```bash
tail -f logs/combined-$(date +%Y-%m-%d).log
```

### MongoDB Shell

```bash
mongosh
use ip_escrow
db.users.find().pretty()
db.projects.find().pretty()
```

### Reset Database (Development Only!)

```bash
mongosh
use ip_escrow
db.dropDatabase()
```

## 🚀 Production Deployment

For production deployment:

1. **Use Production MongoDB**: MongoDB Atlas recommended
2. **Set NODE_ENV**: `NODE_ENV=production`
3. **Use PM2**: `npm install -g pm2 && pm2 start src/server.js`
4. **Enable HTTPS**: Use nginx reverse proxy
5. **Set Strong JWT_SECRET**: Use a secure random string
6. **Monitor Logs**: Setup log aggregation (e.g., ELK stack)
7. **Backup Database**: Setup automated backups

## 📞 Support

- GitHub Issues: Report bugs and request features
- Documentation: Check README.md for detailed API docs
- Logs: Check `logs/` directory for error details

---

**Happy Building! 🎉**
