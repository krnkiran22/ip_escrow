# 🔍 Why Transaction Reverts - Debugging Guide

## ✅ Progress So Far:

1. ✅ BigInt serialization error - **FIXED**
2. ✅ Balance check working
3. ❌ Transaction still reverting - **Let's find out why**

---

## 🎯 What to Do Now:

### Step 1: Start Dev Server with Fresh State

```bash
# Stop any running server (Ctrl+C)
npm run dev
```

### Step 2: Open Browser Console BEFORE Creating Project

1. Open browser: http://localhost:5173/create-project
2. **Press F12** (open DevTools)
3. Go to **Console** tab
4. **Keep it open** while you create the project

### Step 3: Create Test Project (Small Amounts)

Fill the form:

**Basic Info:**

- Title: "Test"
- Category: Any
- Description: "Test project"
- Skills: Add "Testing"

**Milestones (IMPORTANT):**

```
Milestone 1:
  Name: "Phase 1"     ← Make sure name is filled!
  Amount: 1
  Timeline: "1 week"

Milestone 2:
  Name: "Phase 2"     ← Make sure name is filled!
  Amount: 2
  Timeline: "1 week"

Milestone 3:
  Name: "Phase 3"     ← Make sure name is filled!
  Amount: 2
  Timeline: "1 week"
```

**Revenue:** Default

**License:** Any

**Review:** ✅ Check terms

### Step 4: Submit and Watch Console

Click "Launch Project"

### Step 5: Copy Console Output

You should see detailed logs like:

```
🚀 Creating project on blockchain...
✅ Input validation passed
   Title: Test
   Milestones: 3
   Amounts: [1, 2, 2]
   Names: ["Phase 1", "Phase 2", "Phase 3"]

💰 Project Cost Calculation:
   Milestone amounts: [1, 2, 2]
   Total Budget: 5.0000 IP
   Platform Fee (2%): 0.1000 IP
   Total Required: 5.1000 IP

🔍 Checking wallet balance...
   Your Balance: 9.8139 IP
   Required: 5.1000 IP

✅ Balance check passed

📝 Final Transaction Parameters:
   Contract: 0x701dca87b35B0e65Ba8bE229878FDdA3887952b8
   Function: createProject
   Arg 1 - Title: Test
   Arg 2 - Description: Test project
   Arg 3 - Amounts (array): ["1000000000000000000", "2000000000000000000", "2000000000000000000"]
   Arg 4 - Milestone Names (array): ["Phase 1", "Phase 2", "Phase 3"]
   Value (msg.value): 5100000000000000000 wei = 5.1000 IP
   From address: 0x27dBFd227d05B32360306f30a4B439504Facdd79

🔐 Sending transaction to wallet for approval...
✅ Transaction sent!
   Hash: 0x...
```

**Copy ALL of this output and send it to me!**

---

## 🔍 What We're Looking For:

### Check #1: Arrays Match?

```
Arg 3 - Amounts (array): [3 items]
Arg 4 - Milestone Names (array): [3 items]
```

✅ Both should have same number of items!

### Check #2: All Values Valid?

```
Amounts: ["1000000000000000000", "2000000000000000000", "2000000000000000000"]
```

✅ All should be > 0
✅ Should be in wei (18 zeros)

```
Names: ["Phase 1", "Phase 2", "Phase 3"]
```

✅ None should be empty ""
✅ All should have actual text

### Check #3: Balance Sufficient?

```
✅ Balance check passed
```

✅ Should see this message

### Check #4: Transaction Hash

If you see:

```
✅ Transaction sent!
   Hash: 0x1234567890abcdef...
```

Copy that hash and run:

```bash
node src/test/checkTransaction.js 0xYOUR_HASH
```

This will tell us EXACTLY why it reverted!

---

## 🐛 Common Causes of Revert:

### 1. Milestone Names Empty

**Problem:**

```javascript
milestoneNames: ["Phase 1", "", "Phase 3"]; // ❌ Empty string!
```

**Solution:** Make sure ALL milestone names are filled in the form

### 2. Amounts Zero or Negative

**Problem:**

```javascript
amounts: [0, 2, 2]; // ❌ First milestone is 0!
```

**Solution:** Make sure all amounts > 0

### 3. Array Length Mismatch

**Problem:**

```javascript
amounts: [1, 2, 2]; // 3 items
names: ["Phase 1", "Phase 2"]; // 2 items ❌
```

**Solution:** Add same number of milestones for both

### 4. Value Too Low

**Problem:**

```
Value sent: 5.00 IP
Required: 5.10 IP  // ❌ Missing the 2% fee!
```

**Solution:** This should be automatic now, but check the logs

### 5. Contract Bug

If everything looks correct but still reverts, the contract itself might have an issue.

---

## 🎯 Action Items:

1. **Clear browser cache** (Cmd+Shift+R or Ctrl+Shift+R)

2. **Restart dev server:**

   ```bash
   npm run dev
   ```

3. **Open browser with console** (F12)

4. **Create test project** with small amounts (1, 2, 2 IP)

5. **Watch console closely** - copy ALL output

6. **If transaction sent:**

   - Copy the hash (0x...)
   - Run: `node src/test/checkTransaction.js 0xHASH`

7. **Send me:**
   - Full console output
   - Transaction hash
   - checkTransaction.js output
   - What amounts/names you used

---

## 💡 Expected Output (Success):

```
✅ Input validation passed
✅ Balance check passed
✅ Transaction sent!
✅ Transaction confirmed!
   Status: success
✅ Project created with ID: 1

🎉 Project created successfully! ID: 1
```

Then:

```bash
$ node src/test/comprehensiveTest.js

📈 Total Projects: 1  ✅
```

---

## 🔧 What I Fixed:

1. ✅ **BigInt serialization** - No longer crashes on error
2. ✅ **Input validation** - Checks all parameters before sending
3. ✅ **Array validation** - Ensures arrays match
4. ✅ **Better logging** - Shows exactly what's sent to contract
5. ✅ **Clear errors** - Tells you exactly what's wrong

---

## 🚀 Try Again Now:

1. Restart: `npm run dev`
2. Browser: http://localhost:5173/create-project
3. Console: F12 → Console tab
4. Create: Use 1, 2, 2 IP amounts
5. Copy: ALL console output
6. Send: To me for analysis

**Let's find out why it's reverting!** 🔍
