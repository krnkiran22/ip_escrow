# IP ESCROW - QUICK SETUP GUIDE# 🚀 Quick Start Guide - Test Your Frontend

## 🚀 GET STARTED IN 5 MINUTES## ⚡ 5-Minute Quick Test

### Step 1: Get Pinata Credentials (2 minutes)### 1. Start the App (30 sec)

1. Go to https://pinata.cloud```bash

2. Sign up (free tier: 1GB storage, 100 requests/month)cd /Users/kiran/Desktop/dev/ip_escrow

3. Dashboard → **API Keys** → **New Key**npm run dev

4. Enable permissions: ✅ All```

5. **Copy 3 credentials**:

   - API KeyOpen: http://localhost:5173

   - API Secret

   - JWT Token### 2. Connect Wallet (1 min)

### Step 2: Update Environment (1 minute)1. Click "Connect Wallet" (top right)

2. Select MetaMask

Open `.env` file and update these lines:3. Approve connection

4. See your address displayed

````env

# Replace these with your actual Pinata credentials### 3. Test CreateProject (3 min)

VITE_PINATA_API_KEY=paste_your_api_key_here

VITE_PINATA_SECRET_KEY=paste_your_secret_key_here1. Click "Create Project" in nav

VITE_PINATA_JWT=paste_your_jwt_token_here2. **Step 1:**

```   - Enter title: "Test Project"

   - Click category: "Design & Art"

**Save the file!**   - Write description (any text)

   - Type "React" → Press Enter (adds skill)

### Step 3: Restart Dev Server (30 seconds)   - Click upload area → Select an image

3. Click "Next Step"

```bash4. **Step 2:**

# Stop current server (Ctrl+C)   - Enter milestone name: "Phase 1"

# Start again   - Enter budget: "1000"

npm run dev   - Enter timeline: "2 weeks"

```5. Click "Next Step"

6. **Step 3:**

### Step 4: Run Tests (1.5 minutes)   - Drag sliders (default 50/50 is fine)

   - Select a license type

```bash7. Click "Next Step"

node src/test/runTests.js8. **Step 4:**

```   - Review all data

   - Check "I agree to terms"

✅ If all tests pass → **Module 4 is complete!**   - Click "Launch Project"

9. See success toast → Redirects to dashboard

---

### ✅ If All Steps Work:

## 🧪 WHAT THE TESTS DO

**Your frontend is fully functional!**

### Test 1: Single File Upload

- Creates test file---

- Uploads to IPFS

- Gets IPFS hash## 📋 What to Test

- Generates gateway URL

### Must Test ✅

### Test 2: JSON Metadata

- Creates metadata object- [ ] Wallet connects

- Uploads to IPFS- [ ] CreateProject form works

- Fetches back- [ ] Image upload works

- Verifies data integrity- [ ] Skills add/remove works

- [ ] Form submits successfully

### Test 3: Full Integration

- Simulates complete workflow### Should Test ⚠️

- File → Hash → Upload → Metadata

- Tests contract connection- [ ] Multiple file uploads

- Prepares Story Protocol data- [ ] Add/remove milestones

- [ ] Revenue sliders sync

---- [ ] Error validation (try submitting empty form)

- [ ] Navigate back/forth (data persists?)

## 🎯 NEXT: INTEGRATE INTO APP

### Nice to Test 📱

### Add FileUpload to CreateProject Page

- [ ] Responsive design (resize browser)

**Location**: `src/pages/CreateProject.jsx`- [ ] Disconnect wallet

- [ ] Upload multiple images

**Add import**:- [ ] Add many skills

```javascript- [ ] Test on mobile device

import FileUpload from '../components/FileUpload';

```---



**Add to Step 1 (after skills section)**:## 🐛 Found a Bug?

```jsx

{/* IP Asset Upload */}### Report Format:

<div className="space-y-2">

  <label className="block text-sm font-medium">```

    Upload IP Assets**Bug:** [Short description]

  </label>**Steps:**

  <FileUpload1. Click X

    onUploadComplete={(result) => {2. Do Y

      if (result.success) {3. See error Z

        setFormData({

          ...formData,**Expected:** Should do A

          ipAssets: [...(formData.ipAssets || []), ...result.uploads]**Actual:** Does B instead

        });

        toast.success('Files uploaded to IPFS!');**Browser:** Chrome/Firefox/Safari

      }**Screenshot:** [If possible]

    }}```

    acceptedTypes={['image/*', 'application/pdf', 'text/*', 'video/*']}

    maxSize={50 * 1024 * 1024} // 50MB### Where to Report:

    multiple={true}

    showProgress={true}- Create GitHub issue

  />- Or document in test checklist

</div>- Or message developer

````

---

**Update formData state**:

````javascript## 📚 Full Documentation

const [formData, setFormData] = useState({

  // ... existing fields| Document                               | Purpose                | Time        |

  ipAssets: [], // Add this| -------------------------------------- | ---------------------- | ----------- |

});| `TESTING_CHECKLIST_WALLET_USERFLOW.md` | Complete testing guide | 75 min      |

```| `WALLET_INTEGRATION_COMPLETE.md`       | Implementation details | Read 10 min |

| `IMPLEMENTATION_SUMMARY.md`            | High-level overview    | Read 5 min  |

**Display in Step 4 (Review)**:| `QUICK_START.md`                       | This guide             | 5 min test  |

```jsx

{/* Uploaded Assets */}---

{formData.ipAssets && formData.ipAssets.length > 0 && (

  <div>## 🎯 Success Criteria

    <h3 className="font-semibold mb-2">IP Assets</h3>

    <div className="space-y-2">Your frontend is working if:

      {formData.ipAssets.map((asset, i) => (

        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">- ✅ Wallet connects without errors

          <span>{asset.name}</span>- ✅ All 4 CreateProject steps load

          <a - ✅ Form data persists when navigating back/forth

            href={asset.url} - ✅ Images upload and show preview

            target="_blank" - ✅ Skills add when pressing Enter

            rel="noopener noreferrer"- ✅ Milestones can be added/removed

            className="text-blue-600 hover:underline"- ✅ Revenue sliders sync to 100%

          >- ✅ Form submits successfully

            View on IPFS- ✅ No console errors (F12)

          </a>- ✅ Success toast appears

        </div>- ✅ Redirects to dashboard

      ))}

    </div>---

  </div>

)}## ⚙️ Environment Check

````

### Required in `.env`:

---

````env

## 📱 TEST IN BROWSERVITE_WALLETCONNECT_PROJECT_ID=your_project_id

VITE_STORY_NETWORK_RPC=https://aeneid.storyrpc.io

1. Go to http://localhost:5173VITE_STORY_CHAIN_ID=1315

2. Click "Create Project"VITE_STORY_EXPLORER=https://aeneid.storyscan.xyz

3. Fill in project detailsVITE_IP_ESCROW_ADDRESS=0x4d6fd97b2bc6ec4d023d30106e8b530e2d185725

4. **Drag & drop files** or click to uploadVITE_REVENUE_VAULT_ADDRESS=0x5f39371b384748b6c2147f601d0c706d0f680111

5. Watch progress bars```

6. See success messages

7. Continue to review step### MetaMask Setup:

8. See uploaded files listed

9. Submit project to blockchain- Network: Story Aeneid

- Chain ID: 1315

---- RPC: https://aeneid.storyrpc.io

- Currency: IP

## 🔍 VERIFY IT WORKS

---

### Check Pinata Dashboard

1. Go to https://app.pinata.cloud## 🆘 Troubleshooting

2. Click "Files" in sidebar

3. You should see your uploaded files### App won't start

4. Each file has an IPFS hash (CID)

```bash

### Check Gateway URLsrm -rf node_modules package-lock.json

1. Copy any gateway URL from test outputnpm install

2. Paste in browsernpm run dev

3. File should load/download```



### Check Test Output### Wallet won't connect

Look for these ✅ marks:

- ✅ IPFS configured properly- Install MetaMask extension

- ✅ Upload successful- Add Story Aeneid network to MetaMask

- ✅ Data integrity verified- Refresh page and try again

- ✅ All tests passed

### Images won't upload

---

- File must be < 10MB

## ⚠️ TROUBLESHOOTING- File must be image (jpg, png, gif, webp) or PDF

- Check browser console for errors

### "IPFS not configured"

→ Check `.env` file has real credentials (no "your_xxx_here")### Form won't submit

→ Restart dev server after updating `.env`

- Connect wallet first

### "Upload failed: 401 Unauthorized"- Check "I agree to terms" checkbox

→ API credentials are wrong- Fill all required fields

→ Generate new key in Pinata dashboard- Check console (F12) for errors

→ Update `.env` with new credentials

---

### "Upload failed: Network error"

→ Check internet connection## 🎉 Next Steps After Testing

→ Check Pinata status: https://status.pinata.cloud

→ Try again in a few seconds1. **If everything works:**



### Test file not found errors   - ✅ Mark as production-ready

→ Make sure you're running tests from project root   - ✅ Move to backend integration

→ Use: `node src/test/runTests.js` (not `cd src/test && node runTests.js`)   - ✅ Deploy to staging



---2. **If you find bugs:**



## 📊 PROJECT STATUS AFTER MODULE 4   - 🐛 Document them clearly

   - 🐛 Report with steps to reproduce

```   - 🐛 Continue testing other features

Progress: [██████████░░░░░░░░░░] 50% Complete

3. **If you want to extend:**

✅ Module 1: Frontend UI (DONE)   - 📝 Add more categories

✅ Module 3: Story Protocol (DONE)   - 📝 Add more file types

✅ Module 4: IPFS Integration (DONE)   - 📝 Add project templates

⏳ Module 5: Backend API (NEXT)   - 📝 Add auto-save drafts

⏳ Module 7: Frontend-Contract Integration

⏳ Module 9: Testing & Bug Fixes---

⏳ Module 10: Demo & Submission

**Guide Version:** 1.0

Time Remaining: 2 days**Last Updated:** October 31, 2025

Estimated Remaining Work: ~30 hours**Estimated Time:** 5 minutes

```**Status:** Ready to Test!



------



## 🎯 SUCCESS! YOU'RE DONE WITH MODULE 4 WHEN:## 🚀 Start Testing Now!



- ✅ All test files pass```bash

- ✅ Files visible in Pinata dashboardnpm run dev

- ✅ Gateway URLs work in browser```

- ✅ FileUpload component added to CreateProject

- ✅ Can upload files in the appThen open http://localhost:5173 and connect your wallet! 🎯

- ✅ IPFS hashes stored in form data
- ✅ Files shown in review step

**Then move to Module 5: Backend API** 🚀

---

## 🆘 NEED HELP?

1. Read `MODULE_4_COMPLETE.md` for detailed docs
2. Check test output for specific errors
3. Verify `.env` credentials are correct
4. Check Pinata dashboard for uploads
5. Use browser DevTools console for errors

---

**Last Updated**: ${new Date().toISOString()}
**Module**: 4 - IPFS Integration
**Status**: Complete - Testing Pending
````
