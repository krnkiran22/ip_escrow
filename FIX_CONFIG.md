# 🔧 QUICK FIX GUIDE - Configuration Issues

**Time Required:** 30 minutes
**Status:** 🔴 CRITICAL - Must fix before testing

---

## Issue #1: Contract Address Variable Names Mismatch

### Problem:

```javascript
// constants.js expects:
CONTRACTS.FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;
CONTRACTS.REVENUE_VAULT = import.meta.env.VITE_REVENUE_VAULT_ADDRESS;

// But .env provides:
VITE_IPESCROW_CONTRACT_ADDRESS = 0x701dca87b35b0e65ba8be229878fdda3887952b8;
VITE_REVENUE_VAULT_CONTRACT_ADDRESS = 0x5f39371b384748b6c2147f601d0c706d0f680111;
```

### Solution: Update .env file

Run this command to fix:

```bash
cat > /Users/kiran/Desktop/dev/ip_escrow/.env << 'EOF'
# Story Protocol Configuration - Aeneid Testnet
VITE_STORY_NETWORK_RPC=https://aeneid.storyrpc.io
VITE_STORY_CHAIN_ID=1315
VITE_STORY_EXPLORER=https://aeneid.storyscan.xyz

# Deployed Contracts - FIXED VARIABLE NAMES
VITE_FACTORY_CONTRACT_ADDRESS=0x701dca87b35B0e65Ba8bE229878FDdA3887952b8
VITE_REVENUE_VAULT_ADDRESS=0x5f39371b384748b6c2147f601d0c706d0f680111

# Story Protocol API
VITE_STORY_API_URL=https://api.story.foundation

# IPFS Configuration - Pinata
VITE_PINATA_API_KEY=126736c72438a825ee80
VITE_PINATA_SECRET_KEY=e7049a79076a1ccb9b62f55f6b5aeb2aa77d64bef706c9cc466bba6eab05b3fe
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMGQ4ZGQ5OS0xZTIyLTQwNGEtODBhZS1hNjhjM2E3OTgzZTkiLCJlbWFpbCI6ImtpcmFucGVyNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTI2NzM2YzcyNDM4YTgyNWVlODAiLCJzY29wZWRLZXlTZWNyZXQiOiJlNzA0OWE3OTA3NmExY2NiOWI2MmY1NWY2YjVhZWIyYWE3N2Q2NGJlZjcwNmM5Y2M0NjZiYmE2ZWFiMDViM2ZlIiwiZXhwIjoxNzkzNjgxMzU5fQ.ujFMLOFG5VUQwiNdQlmDcmKiTYByKar4YD0hkPVFOhg
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
EOF
```

✅ **DONE!** Contract addresses now match constants.js expectations

---

## Issue #2: Chain ID Mismatch

### Problem:

```javascript
// constants.js has:
chainId: 1513;

// .env has:
VITE_STORY_CHAIN_ID = 1315;

// These don't match! Which is correct?
```

### Solution: Verify Correct Chain ID

#### Story Aeneid Testnet Details:

According to your deployed contracts, the chain is **Story Aeneid** which uses:

- **Chain ID: 1315** (Aeneid testnet)
- RPC: https://aeneid.storyrpc.io
- Explorer: https://aeneid.storyscan.xyz

The **1513** was for the OLD testnet (Story Testnet).

### Fix: Update constants.js

Run this command:

```bash
# Update constants.js to use 1315 (Aeneid)
```

I'll create the fix for you...

---

## Issue #3: Missing RPC/Explorer URLs in constants.js

### Problem:

constants.js references wrong env variable names:

- `VITE_STORY_RPC_URL` (doesn't exist in .env)
- `VITE_EXPLORER_URL` (doesn't exist in .env)

### Solution: Use correct variable names

The .env file has:

- `VITE_STORY_NETWORK_RPC`
- `VITE_STORY_EXPLORER`

---

## 🚀 AUTOMATED FIX SCRIPT

Run this to fix ALL issues at once:

```bash
#!/bin/bash
echo "🔧 Fixing IP Escrow Configuration Issues..."

# 1. Backup current .env
cp .env .env.backup
echo "✅ Backed up .env to .env.backup"

# 2. Create corrected .env
cat > .env << 'EOF'
# Story Protocol Configuration - Aeneid Testnet
VITE_STORY_NETWORK_RPC=https://aeneid.storyrpc.io
VITE_STORY_CHAIN_ID=1315
VITE_STORY_EXPLORER=https://aeneid.storyscan.xyz

# Deployed Contracts - CORRECTED VARIABLE NAMES
VITE_FACTORY_CONTRACT_ADDRESS=0x701dca87b35B0e65Ba8bE229878FDdA3887952b8
VITE_REVENUE_VAULT_ADDRESS=0x5f39371b384748b6c2147f601d0c706d0f680111

# Story Protocol API
VITE_STORY_API_URL=https://api.story.foundation

# IPFS Configuration - Pinata
VITE_PINATA_API_KEY=126736c72438a825ee80
VITE_PINATA_SECRET_KEY=e7049a79076a1ccb9b62f55f6b5aeb2aa77d64bef706c9cc466bba6eab05b3fe
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMGQ4ZGQ5OS0xZTIyLTQwNGEtODBhZS1hNjhjM2E3OTgzZTkiLCJlbWFpbCI6ImtpcmFucGVyNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTI2NzM2YzcyNDM4YTgyNWVlODAiLCJzY29wZWRLZXlTZWNyZXQiOiJlNzA0OWE3OTA3NmExY2NiOWI2MmY1NWY2YjVhZWIyYWE3N2Q2NGJlZjcwNmM5Y2M0NjZiYmE2ZWFiMDViM2ZlIiwiZXhwIjoxNzkzNjgxMzU5fQ.ujFMLOFG5VUQwiNdQlmDcmKiTYByKar4YD0hkPVFOhg
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
EOF
echo "✅ Created corrected .env file"

# 3. Show diff
echo ""
echo "📋 Changes made:"
diff .env.backup .env || true

echo ""
echo "✅ Configuration fixed!"
echo ""
echo "Next steps:"
echo "1. Review changes above"
echo "2. Run: npm run build"
echo "3. Run: npm run dev"
echo "4. Test wallet connection"
```

---

## Verification Steps

After running the fix:

### 1. Check Contract Addresses Load

```bash
npm run dev
# Open browser console
console.log(import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS)
# Should output: 0x701dca87b35B0e65Ba8bE229878FDdA3887952b8
```

### 2. Check Chain ID

```bash
# In browser console
console.log(import.meta.env.VITE_STORY_CHAIN_ID)
# Should output: 1315
```

### 3. Verify on Explorer

Visit: https://aeneid.storyscan.xyz/address/0x701dca87b35B0e65Ba8bE229878FDdA3887952b8

- ✅ Contract should be visible
- ✅ Should show transactions
- ✅ Should show contract code

---

## 🎯 Next Steps After Fix

Once config is fixed:

1. **Rebuild Project**

   ```bash
   npm run build
   ```

2. **Start Dev Server**

   ```bash
   npm run dev
   ```

3. **Open in Browser**

   ```
   http://localhost:5173
   ```

4. **Test Wallet Connection**

   - Click "Connect Wallet"
   - Approve MetaMask
   - Verify address displays

5. **Test Create Project**
   - Navigate to Create Project
   - Fill in all 4 steps
   - Submit transaction
   - Check on explorer

---

## 📋 Checklist

- [ ] Backup current .env
- [ ] Run automated fix script
- [ ] Rebuild project (`npm run build`)
- [ ] Start dev server (`npm run dev`)
- [ ] Test wallet connection
- [ ] Verify contract addresses in browser console
- [ ] Check contracts on explorer
- [ ] Test create project
- [ ] Celebrate! 🎉

---

**Estimated Time:** 30 minutes
**Difficulty:** Easy (mostly copy-paste)
**Impact:** CRITICAL (unblocks all testing)

---

**Created:** 2025-11-05
**Status:** 🔴 ACTION REQUIRED
