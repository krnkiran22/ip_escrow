# 🔍 TRANSACTION DEBUGGING GUIDE

## 🚨 Problem: Project ID shows 0 but IPFS hash exists

### What This Means:

Your frontend successfully:

- ✅ Uploaded files to IPFS
- ✅ Created project metadata
- ✅ Uploaded metadata to IPFS (got hash: QmW8EEsaw55xXhf2Jp3gXo3FYwoJAzxSejPZ9T6bfjZ9UH)
- ❌ **But the blockchain transaction likely FAILED/REVERTED**

---

## 🔎 Step 1: Check Browser Console

### Open DevTools:

- Press **F12** (or Cmd+Option+I on Mac)
- Go to **Console** tab
- Look for red error messages

### What to Look For:

```
❌ Project creation failed: [error message]
```

Common errors:

1. **"insufficient funds"** → Not enough IP tokens
2. **"execution reverted"** → Transaction failed on-chain
3. **"user rejected"** → You cancelled in MetaMask
4. **"gas estimation failed"** → Transaction would fail

### Copy the Error:

- Right-click the error
- "Copy message"
- Send it to me

---

## 🔎 Step 2: Check MetaMask

### Look at Recent Activity:

1. Open MetaMask
2. Click **Activity** tab
3. Find your most recent transaction

### Check Status:

**If it says "Confirmed" ✅:**

- Transaction went through
- But might have reverted
- Go to Step 3

**If it says "Failed" ❌:**

- Transaction was rejected by network
- Common reasons:
  - Insufficient balance
  - Nonce issues
  - Gas too low

**If it says "Pending" ⏳:**

- Still processing
- Wait 1-2 minutes
- Then refresh

**If nothing shows:**

- Transaction wasn't even sent
- Check browser console for errors

---

## 🔎 Step 3: Get Transaction Hash

### From MetaMask:

1. Click on the transaction
2. Click **"View on block explorer"**
3. OR copy the transaction hash (starts with 0x...)

### From Browser Console:

Look for:

```
✅ Transaction sent: 0x1234567890abcdef...
```

Copy the hash (the 0x... part)

---

## 🔎 Step 4: Check Transaction Details

### Run This Command:

```bash
node src/test/checkTransaction.js 0xYOUR_TRANSACTION_HASH_HERE
```

Replace `0xYOUR_TRANSACTION_HASH_HERE` with your actual transaction hash.

### What You'll See:

**If successful:**

```
✅ Transaction was SUCCESSFUL
✅ SUCCESS: Project was created successfully!
   Project ID: 1
```

**If reverted:**

```
❌ Transaction REVERTED
❌ PROBLEM IDENTIFIED:
   Transaction was confirmed BUT project count is still 0
   This means the transaction likely REVERTED
```

---

## 🔧 Common Fixes

### Fix 1: Insufficient Balance

**Problem:** Not enough IP tokens to cover budget + fee

**Check:**

```bash
node src/test/comprehensiveTest.js
# Look for: "💰 Balance: X.XX IP"
```

**Solution:**

```bash
# Get more tokens from faucet
open https://faucet.story.foundation
```

**Calculate needed:**

- Your milestones total: X IP
- Platform fee (2%): X \* 0.02 IP
- Total needed: X + (X \* 0.02) IP
- Plus gas: ~0.01 IP

**Example:**

- 3 milestones: 10 + 15 + 20 = 45 IP
- Fee: 45 \* 0.02 = 0.9 IP
- Total: 45.9 IP needed

### Fix 2: Try Smaller Amounts

**Problem:** Using 100+ IP per milestone

**Solution:** Start small to test

**Minimal test project:**

```
Milestone 1: 1 IP
Milestone 2: 2 IP
Milestone 3: 2 IP
Total: 5 IP + 0.1 fee = 5.1 IP needed
```

**Steps:**

1. Go to Create Project
2. Fill in form
3. For each milestone, use 1-5 IP only
4. Submit
5. If this works, then it's a balance issue

### Fix 3: Network Issues

**Problem:** Wrong network or connection issues

**Check MetaMask Network:**

1. Open MetaMask
2. Top center should say: **"Story Aeneid Testnet"**
3. If not, click it and select Story Aeneid

**If network not listed:**

```
Add Network Manually:
- Network Name: Story Aeneid Testnet
- RPC URL: https://aeneid.storyrpc.io
- Chain ID: 1315
- Currency: IP
- Explorer: https://aeneid.storyscan.xyz
```

### Fix 4: Contract Parameters

**Problem:** Contract rejecting invalid data

**Check your form data:**

- ✅ Title: Not empty
- ✅ Description: Not empty
- ✅ At least 1 milestone
- ✅ All milestone amounts > 0
- ✅ All milestone names not empty

**In browser console, look for:**

```javascript
Project details: {
  title: "...",
  description: "...",
  milestones: 3,
  totalBudget: "...",
  platformFee: "...",
  totalValue: "..."
}
```

---

## 📊 Diagnostic Checklist

Run through this checklist:

### Before Creating Project:

- [ ] MetaMask installed and unlocked
- [ ] Connected to Story Aeneid Testnet (Chain ID 1315)
- [ ] Wallet has sufficient balance (run: `node src/test/comprehensiveTest.js`)
- [ ] Browser console open (F12)
- [ ] Dev server running (`npm run dev`)

### When Creating Project:

- [ ] All required fields filled
- [ ] At least 1 milestone added
- [ ] Milestone amounts > 0
- [ ] See "Connect Wallet" or your address displayed
- [ ] Click "Launch Project"
- [ ] MetaMask popup appears
- [ ] Review transaction details in MetaMask:
  - [ ] Network: Story Aeneid Testnet
  - [ ] To: 0x701d... (contract address)
  - [ ] Value: (your budget + 2%)
- [ ] Click "Confirm" in MetaMask
- [ ] See progress indicator
- [ ] Wait for confirmation

### After Transaction:

- [ ] Check browser console for errors
- [ ] Check MetaMask activity
- [ ] Note transaction hash
- [ ] Run: `node src/test/checkTransaction.js 0x...`
- [ ] Run: `node src/test/comprehensiveTest.js`
- [ ] Check project count increased

---

## 🎯 Next Steps Based on Results

### If you see in browser console:

**"insufficient funds"**
→ Get more IP tokens from faucet

**"execution reverted"**
→ Run checkTransaction.js to see why

**"user rejected"**
→ You cancelled - try again

**"Transaction confirmed but count is 0"**
→ Transaction reverted - check contract parameters

### If MetaMask shows:

**"Failed"**
→ Check network, balance, and try again

**"Confirmed"**
→ Run checkTransaction.js to verify

**"Pending" for > 2 minutes**
→ Speed up or cancel, then retry

---

## 🆘 Still Stuck?

### Provide This Info:

1. **Transaction Hash** (from MetaMask or console)

   ```
   0x...
   ```

2. **Browser Console Output** (copy all red errors)

   ```
   ❌ Error: ...
   ```

3. **Your Balance**

   ```bash
   node src/test/comprehensiveTest.js
   # Copy the "Balance: X.XX IP" line
   ```

4. **Milestone Amounts** (what you entered)

   ```
   Milestone 1: X IP
   Milestone 2: Y IP
   Milestone 3: Z IP
   Total: X+Y+Z IP
   ```

5. **MetaMask Network** (screenshot or name)

6. **Transaction Check Result**
   ```bash
   node src/test/checkTransaction.js 0xYourHash
   # Copy entire output
   ```

---

## 🔧 Emergency Recovery

### If completely stuck:

1. **Reset and start fresh:**

   ```bash
   # Stop dev server (Ctrl+C)
   # Clear browser cache
   # Restart dev server
   npm run dev
   ```

2. **Try minimal project:**

   - Title: "Test"
   - Category: Any
   - Description: "Test"
   - Skills: "Test"
   - 1 milestone: "Test", 1 IP, "1 week"
   - Submit

3. **Check each step:**
   - Watch browser console
   - Note any errors immediately
   - Copy transaction hash
   - Don't close browser until confirmed

---

## 📝 Success Criteria

You'll know it worked when:

```bash
node src/test/comprehensiveTest.js
```

Shows:

```
📈 Total Projects: 1  # ← Should be 1 or more
```

And browser console shows:

```
✅ Project created with ID: 1  # ← Should NOT be 0
```

---

**Next Steps:**

1. Check browser console
2. Get transaction hash
3. Run: `node src/test/checkTransaction.js 0x...`
4. Send me the results

I'll help you debug from there! 🚀
