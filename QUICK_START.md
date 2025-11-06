# 🎯 QUICK START GUIDE - Freelancer Application & Payment System# IP ESCROW - QUICK SETUP GUIDE# 🚀 Quick Start Guide - Test Your Frontend

## ✅ What's Been Built## 🚀 GET STARTED IN 5 MINUTES## ⚡ 5-Minute Quick Test

I've implemented a complete freelancer application and milestone-based payment system for your IP Escrow platform. Here's what you can now do:### Step 1: Get Pinata Credentials (2 minutes)### 1. Start the App (30 sec)

### 🎨 New Features1. Go to https://pinata.cloud```bash

1. **Freelancers can apply to projects** with proposals and portfolio2. Sign up (free tier: 1GB storage, 100 requests/month)cd /Users/kiran/Desktop/dev/ip_escrow

2. **Creators can approve freelancers** via blockchain transaction

3. **Freelancers submit work** with IPFS file uploads3. Dashboard → **API Keys** → **New Key**npm run dev

4. **Creators approve work** → **💰 AUTOMATIC PAYMENT RELEASE**

5. **3 Default demo projects** always show in marketplace4. Enable permissions: ✅ All```

---5. **Copy 3 credentials**:

## 🚀 How to Test It - API KeyOpen: http://localhost:5173

### 1. Start Your Servers - API Secret

```bash - JWT Token### 2. Connect Wallet (1 min)

# Terminal 1: Backend

cd backend### Step 2: Update Environment (1 minute)1. Click "Connect Wallet" (top right)

npm start

2. Select MetaMask

# Terminal 2: Frontend

npm run devOpen `.env` file and update these lines:3. Approve connection

```

4. See your address displayed

### 2. View Marketplace

- Go to `http://localhost:5173/marketplace`````env

- **You should see 3 new default projects:**

  1. 🔧 AI-Powered Mobile App ($5.5 ETH)# Replace these with your actual Pinata credentials### 3. Test CreateProject (3 min)

  2. 🎨 NFT Marketplace UI/UX Design ($3.2 ETH)

  3. 🎥 Educational Video Series ($4.0 ETH)VITE_PINATA_API_KEY=paste_your_api_key_here

- Plus any projects you've created

VITE_PINATA_SECRET_KEY=paste_your_secret_key_here1. Click "Create Project" in nav

### 3. Test Application Flow

VITE_PINATA_JWT=paste_your_jwt_token_here2. **Step 1:**

**As Freelancer:**

1. Click on a project``` - Enter title: "Test Project"

2. Click "Apply to Project"

3. Fill out form (proposal, duration, etc.) - Click category: "Design & Art"

4. Submit → Saved to MongoDB

**Save the file!** - Write description (any text)

**As Creator:**

1. View your project - Type "React" → Press Enter (adds skill)

2. See applications list

3. Click "Approve & Assign"### Step 3: Restart Dev Server (30 seconds) - Click upload area → Select an image

4. Sign blockchain transaction

5. Freelancer is assigned!3. Click "Next Step"

### 4. Test Milestone Flow```bash4. **Step 2:**

**As Freelancer:**# Stop current server (Ctrl+C) - Enter milestone name: "Phase 1"

1. Upload deliverable file

2. Click "Submit Milestone"# Start again - Enter budget: "1000"

3. File → IPFS, then blockchain transaction

npm run dev - Enter timeline: "2 weeks"

**As Creator:**

1. Download & review deliverable```5. Click "Next Step"

2. Click "Approve & Release X ETH"

3. **💰 Smart contract sends ETH directly to freelancer**6. **Step 3:**

---### Step 4: Run Tests (1.5 minutes) - Drag sliders (default 50/50 is fine)

## 📁 New Files Created - Select a license type

### Backend```bash7. Click "Next Step"

- `backend/src/routes/applications.js` - 7 application endpoints

- `backend/src/routes/milestones.js` - 8 milestone endpointsnode src/test/runTests.js8. **Step 4:**

### Frontend``` - Review all data

- `src/components/freelancer/ApplicationForm.jsx` - Apply to project modal

- `src/components/freelancer/MilestoneSubmission.jsx` - Submit work - Check "I agree to terms"

- `src/components/creator/ApplicationsList.jsx` - Review applications

- `src/components/creator/MilestoneReview.jsx` - Approve & pay✅ If all tests pass → **Module 4 is complete!** - Click "Launch Project"

### Marketplace9. See success toast → Redirects to dashboard

- `src/pages/Marketplace.jsx` - Updated with 3 default projects

---

---

### ✅ If All Steps Work:

## ⚠️ What Still Needs Work

## 🧪 WHAT THE TESTS DO

### Critical (To make it fully functional)

**Your frontend is fully functional!**

1. **Update ProjectDetail Page**

   - Currently shows static mockup data### Test 1: Single File Upload

   - Needs to:

     - Fetch real project from API- Creates test file---

     - Show "Apply" button (opens ApplicationForm)

     - Show ApplicationsList (for creators)- Uploads to IPFS

     - Show milestone submission/review components

- Gets IPFS hash## 📋 What to Test

2. **Create Milestones in MongoDB**

   - When creating project, save milestones to database- Generates gateway URL

   - Update `CreateProject.jsx` to call milestone API

### Must Test ✅

3. **Smart Contract Verification**

   - Verify your deployed contract has:### Test 2: JSON Metadata

     - `approveCollaborator(projectId, collaborator)`

     - `submitMilestone(projectId, index, ipfsHash)`- Creates metadata object- [ ] Wallet connects

     - `approveMilestone(projectId, index)` ← releases payment

- Uploads to IPFS- [ ] CreateProject form works

---

- Fetches back- [ ] Image upload works

## 🔌 API Endpoints Created

- Verifies data integrity- [ ] Skills add/remove works

### Applications

- `POST /api/applications/:projectId` - Apply- [ ] Form submits successfully

- `GET /api/applications/project/:projectId` - Get all (creator only)

- `GET /api/applications/my` - My applications### Test 3: Full Integration

- `PUT /api/applications/:id/approve` - Approve (step 1)

- `PUT /api/applications/:id/confirm` - Confirm (step 2)- Simulates complete workflow### Should Test ⚠️

- `PUT /api/applications/:id/reject` - Reject

- File → Hash → Upload → Metadata

### Milestones

- `GET /api/milestones/project/:projectId` - Get all- Tests contract connection- [ ] Multiple file uploads

- `PUT /api/milestones/:id/submit` - Submit (step 1)

- `PUT /api/milestones/:id/confirm-submission` - Confirm (step 2)- Prepares Story Protocol data- [ ] Add/remove milestones

- `PUT /api/milestones/:id/approve` - Approve & pay (step 1)

- `PUT /api/milestones/:id/confirm-approval` - Confirm payment (step 2)- [ ] Revenue sliders sync

- `PUT /api/milestones/:id/reject` - Reject

- `PUT /api/milestones/:id/request-revision` - Request changes---- [ ] Error validation (try submitting empty form)

---- [ ] Navigate back/forth (data persists?)

## 💡 Smart Contract Integration## 🎯 NEXT: INTEGRATE INTO APP

### How Payment Release Works### Nice to Test 📱

1. Creator clicks "Approve Milestone"### Add FileUpload to CreateProject Page

2. Frontend calls: `approveMilestone(projectId, milestoneIndex)`

3. **Smart contract automatically:**- [ ] Responsive design (resize browser)

   - Marks milestone as approved

   - Transfers ETH from escrow → freelancer wallet**Location**: `src/pages/CreateProject.jsx`- [ ] Disconnect wallet

   - Emits PaymentReleased event

4. Frontend waits for confirmation- [ ] Upload multiple images

5. Frontend calls backend to update database

6. Done! Freelancer has been paid 💰**Add import**:- [ ] Add many skills

### Two-Step Pattern```javascript- [ ] Test on mobile device

All blockchain operations follow this safe pattern:import FileUpload from '../components/FileUpload';

`javascript`---

// Step 1: Backend prepares data

const response = await api.put('/milestones/:id/approve');

const { contractParams } = response.data;

**Add to Step 1 (after skills section)**:## 🐛 Found a Bug?

// Step 2: User signs blockchain transaction

const tx = await writeContract({```jsx

functionName: 'approveMilestone',

args: [contractParams.projectId, contractParams.index]{/_ IP Asset Upload _/}### Report Format:

});

<div className="space-y-2">

// Step 3: Wait for confirmation

await waitForTransaction({ hash: tx }); <label className="block text-sm font-medium">```

// Step 4: Update database Upload IP Assets**Bug:** [Short description]

await api.put('/milestones/:id/confirm-approval', { txHash: tx });

````</label>**Steps:**



---  <FileUpload1. Click X



## 🎨 Default Demo Projects    onUploadComplete={(result) => {2. Do Y



These 3 projects always show in marketplace:      if (result.success) {3. See error Z



### 1. AI-Powered Mobile App        setFormData({

- **Category:** Development

- **Budget:** 5.5 ETH          ...formData,**Expected:** Should do A

- **Skills:** React Native, Node.js, MongoDB

- **Creator:** TechCorp (verified)          ipAssets: [...(formData.ipAssets || []), ...result.uploads]**Actual:** Does B instead

- **Applications:** 12

        });

### 2. NFT Marketplace UI/UX Design

- **Category:** Design        toast.success('Files uploaded to IPFS!');**Browser:** Chrome/Firefox/Safari

- **Budget:** 3.2 ETH

- **Skills:** Figma, UI/UX, Web3      }**Screenshot:** [If possible]

- **Creator:** BlockArt Studio (verified)

- **Applications:** 8    }}```



### 3. Educational Video Series    acceptedTypes={['image/*', 'application/pdf', 'text/*', 'video/*']}

- **Category:** Video

- **Budget:** 4.0 ETH    maxSize={50 * 1024 * 1024} // 50MB### Where to Report:

- **Skills:** Video Production, Animation

- **Creator:** Web3 Academy (verified)    multiple={true}

- **Applications:** 15

    showProgress={true}- Create GitHub issue

These help demonstrate the platform even when there are no real projects.

  />- Or document in test checklist

---

</div>- Or message developer

## 🐛 Troubleshooting

````

### Backend won't start

`````bash---

# Kill any process on port 5001

lsof -ti:5001 | xargs kill -9**Update formData state**:



# Restart backend````javascript## 📚 Full Documentation

cd backend

npm startconst [formData, setFormData] = useState({

`````

// ... existing fields| Document | Purpose | Time |

### Can't apply to project

- Make sure you're logged in with a different wallet than the creator ipAssets: [], // Add this| -------------------------------------- | ---------------------- | ----------- |

- Check browser console for errors

- Verify backend is running on port 5001});| `TESTING_CHECKLIST_WALLET_USERFLOW.md` | Complete testing guide | 75 min |

### Blockchain transaction fails```| `WALLET_INTEGRATION_COMPLETE.md` | Implementation details | Read 10 min |

- Make sure you have enough ETH for gas

- Check you're connected to Story Aeneid Testnet (Chain ID: 1315)| `IMPLEMENTATION_SUMMARY.md` | High-level overview | Read 5 min |

- Verify contract address in `.env`

**Display in Step 4 (Review)**:| `QUICK_START.md` | This guide | 5 min test |

### File upload fails

- Check IPFS/Pinata credentials in `.env````jsx

- Verify file is under 50MB

- Check browser console for IPFS errors{/_ Uploaded Assets _/}---

---{formData.ipAssets && formData.ipAssets.length > 0 && (

## 📚 Full Documentation <div>## 🎯 Success Criteria

See `IMPLEMENTATION_SUMMARY.md` for complete technical details including: <h3 className="font-semibold mb-2">IP Assets</h3>

- All API endpoints with examples

- Database schemas <div className="space-y-2">Your frontend is working if:

- Smart contract ABIs

- Testing checklist {formData.ipAssets.map((asset, i) => (

- Environment variables

        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">- ✅ Wallet connects without errors

---

          <span>{asset.name}</span>- ✅ All 4 CreateProject steps load

## 🎯 Next Steps

          <a - ✅ Form data persists when navigating back/forth

### To Complete the System:

            href={asset.url} - ✅ Images upload and show preview

1.  **Update ProjectDetail Page** (most important!)

    - Integrate ApplicationForm modal target="\_blank" - ✅ Skills add when pressing Enter

    - Show ApplicationsList for creators

    - Show milestone submission/review components rel="noopener noreferrer"- ✅ Milestones can be added/removed

    - Fetch real data from API

             className="text-blue-600 hover:underline"- ✅ Revenue sliders sync to 100%

2.  **Test Complete Workflow**

    - Create project → Apply → Approve → Submit work → Get paid >- ✅ Form submits successfully

    - Use 2 different wallets

             View on IPFS- ✅ No console errors (F12)

3.  **Add Authentication**

    - JWT tokens for API requests </a>- ✅ Success toast appears

    - Currently routes expect authentication

         </div>- ✅ Redirects to dashboard

---

      ))}

## 💬 Need Help?

    </div>---

Check these files:

- `IMPLEMENTATION_SUMMARY.md` - Complete technical docs </div>

- `backend/src/routes/applications.js` - Application API

- `backend/src/routes/milestones.js` - Milestone API)}## ⚙️ Environment Check

- `src/components/freelancer/*` - Freelancer UI

- `src/components/creator/*` - Creator UI````

---### Required in `.env`:

**Built on:** November 6, 2025 ---

**Status:** Core System Complete ✅

**Ready for:** Integration & Testing 🚀````env

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

````bash

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
