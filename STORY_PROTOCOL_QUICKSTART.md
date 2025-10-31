# STORY PROTOCOL INTEGRATION - QUICK START GUIDE 🚀

## ⚡ Quick Setup (5 Minutes)

### Step 1: Update Environment Variables

Open `.env` and replace the placeholder addresses:

```bash
# Replace with your actual contract addresses from Module 2
VITE_IPESCROW_CONTRACT_ADDRESS=0xYourActualIPEscrowAddress
VITE_REVENUE_VAULT_CONTRACT_ADDRESS=0xYourActualVaultAddress
```

### Step 2: Install MetaMask Story Testnet (if not added)

The app will auto-prompt, or manually add:

- Network Name: **Story Testnet**
- RPC URL: **https://testnet.storyrpc.io**
- Chain ID: **1513**
- Symbol: **IP**
- Explorer: **https://testnet.storyscan.xyz**

### Step 3: Get Testnet Tokens

Visit Story testnet faucet to get IP tokens for gas fees.

---

## 💻 Usage in Your Components

### Basic Usage

```javascript
import { useStoryProtocol, useIPAsset } from "./hooks";

function MyComponent() {
  // Initialize Story Protocol
  const { isInitialized, walletAddress } = useStoryProtocol();

  // Access IP operations
  const { register, loading } = useIPAsset();

  const handleRegister = async () => {
    const result = await register("QmIPFSHash", {
      title: "My Work",
      description: "Description",
      creator: walletAddress,
    });

    console.log("IP Asset ID:", result.ipAssetId);
  };

  return (
    <button onClick={handleRegister} disabled={loading || !isInitialized}>
      Register IP
    </button>
  );
}
```

---

## 🎯 Key Features Available

### 1. Register IP Asset

```javascript
const { register } = useIPAsset();
await register("ipfsHash", { title, description, creator });
```

### 2. Create License

```javascript
const { createLicense } = useIPAsset();
await createLicense(ipAssetId, { licenseTermsId: "1" });
```

### 3. Configure Royalty

```javascript
const { setRoyalty } = useIPAsset();
await setRoyalty(ipAssetId, 10, [
  { address: "0x...", percentage: 70 },
  { address: "0x...", percentage: 30 },
]);
```

### 4. Create Derivative

```javascript
const { createDerivative } = useIPAsset();
await createDerivative(parentId, childHash, metadata);
```

### 5. File Dispute

```javascript
const { dispute } = useIPAsset();
await dispute(ipAssetId, "reason", "evidenceHash");
```

### 6. Generate Attestation

```javascript
const { attest } = useIPAsset();
await attest(ipAssetId, claimData);
```

---

## 📦 Import Options

### Option 1: Use Hooks (Recommended)

```javascript
import { useIPAsset } from "./hooks/useIPAsset";
```

### Option 2: Use Services Directly

```javascript
import { registerIPAsset } from "./services/ipRegistration";
```

### Option 3: Import Everything

```javascript
import * as StoryServices from "./services";
import * as StoryHooks from "./hooks";
```

---

## 🧪 Test Your Integration

### Test 1: Check Wallet Connection

```javascript
const { isInitialized, walletAddress, isCorrectNetwork } = useStoryProtocol();
console.log("Connected:", isInitialized);
console.log("Address:", walletAddress);
console.log("Correct Network:", isCorrectNetwork);
```

### Test 2: Register Test IP

```javascript
const { register } = useIPAsset();
const result = await register("QmTestHash", {
  title: "Test IP",
  description: "Testing Story Protocol",
  creator: walletAddress,
});
console.log("Success:", result.success);
console.log("IP ID:", result.ipAssetId);
```

### Test 3: Check Transaction on Explorer

```javascript
import { getExplorerTxUrl } from "./utils/storyHelpers";
console.log("View on explorer:", getExplorerTxUrl(txHash));
```

---

## ⚠️ Common Issues & Solutions

### Issue: "MetaMask not installed"

**Solution:** Install MetaMask browser extension

### Issue: "Please switch to Story testnet"

**Solution:** Click the "Switch Network" button in the app

### Issue: "Transaction failed - insufficient funds"

**Solution:** Get testnet IP tokens from faucet

### Issue: "Story Protocol not initialized"

**Solution:** Wait for wallet to connect or refresh page

---

## 📚 API Reference

### useStoryProtocol Hook

```javascript
const {
  storyClient, // Story Protocol client instance
  publicClient, // Viem public client
  isInitialized, // Connection status
  isConnecting, // Loading state
  error, // Error message
  walletAddress, // Connected wallet
  isCorrectNetwork, // Network check
  initialize, // Manual init
  switchNetwork, // Switch to Story
  disconnect, // Disconnect wallet
  reconnect, // Reconnect
} = useStoryProtocol();
```

### useIPAsset Hook

```javascript
const {
  loading, // Operation loading state
  error, // Error message
  isReady, // Ready for operations

  // IP Registration
  register, // Register IP Asset
  registerMilestone, // Register milestone IP
  getDetails, // Get IP details
  getOwned, // Get owned IPs

  // Licensing
  createLicense, // Create license terms
  buyLicense, // Purchase license
  getLicenses, // Get license options

  // Royalty
  setRoyalty, // Configure royalty
  claimRoyalties, // Claim payments
  getPending, // Check pending
  getRoyaltyPayments, // Payment history

  // Derivatives
  createDerivative, // Create derivative
  getGenealogy, // Get genealogy

  // Disputes
  dispute, // File dispute
  getDispute, // Get dispute status

  // Attestation
  attest, // Generate attestation
  verify, // Verify attestation
} = useIPAsset();
```

---

## 🎉 You're Ready!

Your Story Protocol integration is complete and ready to use. Start building amazing IP management features!

**Next:** Integrate these hooks into your existing pages (Dashboard, CreateProject, IPPortfolio, etc.)

---

## 📞 Support

- **Story Protocol Docs:** https://docs.story.foundation
- **Discord:** https://discord.gg/storyprotocol
- **GitHub Issues:** File issues in your repository

---

**Happy Building! 🚀**
