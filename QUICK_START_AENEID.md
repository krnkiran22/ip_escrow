# 🚀 STORY AENEID - QUICK START

## Add to MetaMask (One-Click)

The app will auto-prompt, or add manually:

```
Network Name:    Story Aeneid Testnet
RPC URL:         https://aeneid.storyrpc.io
Chain ID:        1315
Symbol:          IP
Explorer:        https://aeneid.storyscan.xyz
```

---

## Your Contracts

```
IPEscrow:       0x4d6fd97b2bc6ec4d023d30106e8b530e2d185725
RevenueVault:   0x5f39371b384748b6c2147f601d0c706d0f680111
```

**View on Explorer:**
- https://aeneid.storyscan.xyz/address/0x4d6fd97b2bc6ec4d023d30106e8b530e2d185725
- https://aeneid.storyscan.xyz/address/0x5f39371b384748b6c2147f601d0c706d0f680111

---

## Start Dev Server

```bash
npm run dev
```

Then open: http://localhost:5173

---

## Test Story Protocol

```javascript
// In browser console:
import { registerIPAsset } from './src/services/ipRegistration';

// Register test IP
const result = await registerIPAsset('QmTestHash123', {
  title: 'Test IP',
  description: 'Testing Story Protocol',
  creator: 'YOUR_WALLET_ADDRESS'
});

console.log(result);
```

---

## Network Info

| Item | Value |
|------|-------|
| Chain ID | 1315 |
| Hex | 0x523 |
| RPC | https://aeneid.storyrpc.io |
| Explorer | https://aeneid.storyscan.xyz |

---

✅ **All Set!** Ready to build on Story Aeneid Testnet.
