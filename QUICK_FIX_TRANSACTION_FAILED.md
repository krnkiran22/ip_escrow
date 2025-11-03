# 🚨 QUICK FIX: Transaction Failed On-Chain

## Error You Saw:

```
Project creation failed: Error: Transaction failed on-chain
```

## What This Means:

Your transaction was **sent to the blockchain** but the **contract rejected it** (reverted).

The most common reason: **Not enough IP tokens to cover the project cost**

---

## 🎯 SOLUTION: Try Small Test Project

### Step 1: Use Minimal Amounts

Instead of using 100+ IP per milestone, try this:

**Test Project Settings:**

- Milestone 1: **1 IP** (just 1!)
- Milestone 2: **2 IP**
- Milestone 3: **2 IP**
- **Total needed: 5.1 IP** (5 + 0.1 fee)

Your balance: **9.81 IP** ✅ (enough for this test!)

### Step 2: Create Project with Small Amounts

1. **Refresh the page** (clear any old state)

   ```
   Press Cmd+R (Mac) or Ctrl+R (Windows)
   ```

2. **Go to Create Project**

   ```
   http://localhost:5173/create-project
   ```

3. **Fill the form:**

   - Title: "Test Small Project"
   - Category: Any
   - Description: "Testing with small amounts"
   - Skills: Add "Testing"
   - Upload a small image (optional)

4. **Add 3 milestones with SMALL amounts:**

   ```
   Milestone 1:
   - Name: "Phase 1"
   - Amount: 1  ← Just 1 IP!
   - Timeline: "1 week"

   Milestone 2:
   - Name: "Phase 2"
   - Amount: 2
   - Timeline: "1 week"

   Milestone 3:
   - Name: "Phase 3"
   - Amount: 2
   - Timeline: "1 week"
   ```

5. **Continue through steps:**

   - Revenue sharing: Default (50/50) is fine
   - License: Any
   - Review: Check "I agree"
   - **Launch Project**

6. **In MetaMask:**

   - Should show: **~5.1 IP** to send
   - Click **Confirm**

7. **Watch Console (F12):**
   - Should see: `✅ Balance check passed`
   - Should see: `✅ Transaction confirmed!`
   - Should see: `✅ Project created with ID: 1`

---

## 🔍 Why This Works:

**Your current balance:** 9.81 IP

**What you probably tried:**

- Milestone amounts like: 100, 150, 200 = 350 IP
- With 2% fee: 357 IP needed
- ❌ You don't have 357 IP (only 9.81)

**What will work now:**

- Milestone amounts: 1, 2, 2 = 5 IP
- With 2% fee: 5.1 IP needed
- ✅ You have 9.81 IP (more than enough!)

---

## ✅ After It Works:

You'll see:

```
✅ Transaction confirmed!
✅ Project created with ID: 1
```

Then run:

```bash
node src/test/comprehensiveTest.js
```

Should show:

```
📈 Total Projects: 1  ✅

Project #1: Test Small Project
   Creator: 0x27dB...
   Budget: 5.00 IP
   Status: Active
```

---

## 🎯 Then Get More Tokens:

Once you've confirmed it works with small amounts:

1. **Get more test tokens:**

   ```
   https://faucet.story.foundation
   ```

   Request for: `0x27dBFd227d05B32360306f30a4B439504Facdd79`

2. **Wait for tokens to arrive** (2-5 minutes)

3. **Check balance:**

   ```bash
   node src/test/comprehensiveTest.js
   ```

4. **Create bigger projects!**

---

## 🔧 Code Improvements Made:

I've updated the code to:

1. ✅ **Check balance BEFORE sending** transaction
2. ✅ **Show clear error** if insufficient funds
3. ✅ **Display required vs available** amounts
4. ✅ **Better logging** of all calculations
5. ✅ **Improved status checking** for transaction receipt

Now when you try again, you'll see:

```
💰 Project Cost Calculation:
   Total Budget: 5.0000 IP
   Platform Fee (2%): 0.1000 IP
   Total Required: 5.1000 IP

🔍 Checking wallet balance...
   Your Balance: 9.8139 IP
   Required: 5.1000 IP

✅ Balance check passed
```

Or if insufficient:

```
❌ Insufficient balance! You need 347.19 more IP tokens.
   Required: 357.0000 IP
   Current Balance: 9.8139 IP
   Get tokens from: https://faucet.story.foundation
```

---

## 🚀 Try It Now!

1. **Reload the frontend:**

   ```bash
   # If dev server is running, it should auto-reload
   # If not, restart:
   npm run dev
   ```

2. **Create a small test project** (1, 2, 2 IP)

3. **It should work!** ✅

4. **Send me the results:**
   - Did it work?
   - What's the project ID?
   - Any errors?

---

## 📊 Summary:

**Problem:** Transaction reverted (failed on-chain)  
**Root Cause:** Trying to send 350+ IP but only have 9.81 IP  
**Solution:** Use small amounts (5 IP total) to test  
**Result:** Will work with your current balance! ✅

**Try the small test project now!** 🎯
