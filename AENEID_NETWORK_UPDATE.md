# ✅ STORY AENEID TESTNET - CONFIGURATION UPDATE

## 📋 UPDATED CONFIGURATION

All Story Protocol integration files have been updated to use **Story Aeneid Testnet** (Chain ID: 1315).

---

## 🌐 Network Details

| Parameter              | Value                        |
| ---------------------- | ---------------------------- |
| **Network Name**       | Story Aeneid Testnet         |
| **Chain ID (Decimal)** | 1315                         |
| **Chain ID (Hex)**     | 0x523                        |
| **RPC URL**            | https://aeneid.storyrpc.io   |
| **Block Explorer**     | https://aeneid.storyscan.xyz |
| **Currency Symbol**    | IP                           |
| **Currency Decimals**  | 18                           |

---

## 📁 Updated Files

### 1. `.env` ✅

```bash
VITE_STORY_NETWORK_RPC=https://aeneid.storyrpc.io
VITE_STORY_CHAIN_ID=1315
VITE_STORY_EXPLORER=https://aeneid.storyscan.xyz
```

### 2. `src/services/storyProtocol.js` ✅

- Updated chain definition to Story Aeneid
- Chain ID: 1315 (0x523 in hex)
- RPC URL: https://aeneid.storyrpc.io
- Explorer: https://aeneid.storyscan.xyz

### 3. `env.example` ✅

- Template updated for new developers
- Contains Aeneid testnet configuration

---

## 🔧 What Changed

### Before (Odyssey):

- Chain ID: 1516 (0x5EC)
- RPC: https://rpc.odyssey.storyrpc.io
- Explorer: https://odyssey.storyscan.xyz

### After (Aeneid):

- Chain ID: 1315 (0x523)
- RPC: https://aeneid.storyrpc.io
- Explorer: https://aeneid.storyscan.xyz

---

## 🚀 How to Use

### 1. Add Story Aeneid to MetaMask

The application will automatically prompt you to add the network, or add manually:

**Manual Add to MetaMask:**

1. Open MetaMask
2. Click Network dropdown → Add Network
3. Enter these details:
   - Network Name: `Story Aeneid Testnet`
   - RPC URL: `https://aeneid.storyrpc.io`
   - Chain ID: `1315`
   - Currency Symbol: `IP`
   - Block Explorer: `https://aeneid.storyscan.xyz`

### 2. Get Testnet Tokens

Visit the Story Aeneid faucet to get test IP tokens:

- Faucet URL: [Check Story documentation]

### 3. Verify Connection

Your deployed contracts:

```bash
VITE_IPESCROW_CONTRACT_ADDRESS=0x4d6fd97b2bc6ec4d023d30106e8b530e2d185725
VITE_REVENUE_VAULT_CONTRACT_ADDRESS=0x5f39371b384748b6c2147f601d0c706d0f680111
```

View on Explorer:

- IPEscrow: https://aeneid.storyscan.xyz/address/0x4d6fd97b2bc6ec4d023d30106e8b530e2d185725
- RevenueVault: https://aeneid.storyscan.xyz/address/0x5f39371b384748b6c2147f601d0c706d0f680111

---

## ✅ Testing Checklist

After starting your application:

- [ ] MetaMask connects to Story Aeneid (Chain ID 1315)
- [ ] Story Protocol client initializes without errors
- [ ] Can interact with your deployed contracts
- [ ] Transactions appear on https://aeneid.storyscan.xyz
- [ ] IP Asset registration works
- [ ] License creation works
- [ ] All Story Protocol features functional

---

## 🔍 Verify Configuration

Run this in your browser console after connecting:

\`\`\`javascript
// Check connected network
const chainId = await window.ethereum.request({ method: 'eth_chainId' });
console.log('Connected Chain ID:', parseInt(chainId, 16)); // Should show: 1315

// Check Story Protocol config
import { getStoryConfig } from './src/services/storyProtocol';
console.log('Story Config:', getStoryConfig());
\`\`\`

---

## 📚 Resources

- **Story Protocol Docs**: https://docs.story.foundation
- **Aeneid Explorer**: https://aeneid.storyscan.xyz
- **Your GitHub Repo**: https://github.com/krnkiran22/ip_escrow

---

## 🆘 Troubleshooting

### Issue: "Wrong Network" error

**Solution**: Make sure MetaMask is connected to Story Aeneid (Chain ID 1315)

### Issue: "Contract not found"

**Solution**: Verify your contract addresses in `.env` are correct

### Issue: "Insufficient funds"

**Solution**: Get test IP tokens from the Story faucet

### Issue: RPC errors

**Solution**: Check that RPC URL is `https://aeneid.storyrpc.io`

---

## ✨ All Story Protocol Features Ready

All services are configured for Aeneid testnet:

✅ IP Registration (`ipRegistration.js`)
✅ Licensing (`licensing.js`)
✅ Royalty Management (`royalty.js`)
✅ Derivatives & Genealogy (`derivatives.js`)
✅ Dispute Resolution (`disputes.js`)
✅ Attestation (`attestation.js`)
✅ React Hooks (`useStoryProtocol.js`, `useIPAsset.js`)

---

**🎉 Story Aeneid Testnet Configuration Complete!**

Last Updated: October 31, 2025
