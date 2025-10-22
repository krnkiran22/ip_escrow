# IP Escrow - Trust-Free Creative Collaboration Platform

A production-ready frontend for IP Escrow, a blockchain-based platform for trust-free creative collaboration built with React, Vite, and Tailwind CSS.

## 🎯 Overview

IP Escrow enables creators and collaborators to work together securely with automatic IP registration on Story Protocol, smart contract escrow, and automated revenue splits. No lawyers needed.

## 🚀 Features

- **Smart Escrow**: Blockchain-secured fund locking until milestone approval
- **IP Registration**: Automatic on-chain IP ownership registration
- **Automatic Revenue Splits**: Smart contract-based revenue distribution
- **Milestone Management**: Project breakdown with clear deliverables
- **Real-time Analytics**: Track projects, earnings, and IP portfolio
- **Dispute Resolution**: Built-in transparent arbitration system

## 📦 Tech Stack

- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## 🛠️ Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── ui/               # Button, Card, Badge, Input, Modal, ProgressBar
│   ├── shared/           # WalletConnect, IPAssetCard
│   ├── dashboard/        # StatsCard, ProjectCard, ActivityFeed
│   └── projects/         # MilestoneCard, ApplicationCard
├── pages/
│   ├── Landing.jsx       # Hero, Features, How It Works, CTA
│   ├── Dashboard.jsx     # User dashboard with stats and projects
│   ├── Marketplace.jsx   # Browse and filter projects
│   ├── CreateProject.jsx # 4-step project creation form
│   ├── ProjectDetail.jsx # Project overview and applications
│   ├── Profile.jsx       # User profile with tabs
│   └── IPPortfolio.jsx   # IP assets management
├── App.jsx               # Main app with routing
└── main.jsx              # App entry point
```

## 📄 Pages Overview

### 1. Landing Page (/)

Complete marketing page with hero section, features, how-it-works, and CTA sections.

### 2. Dashboard (/dashboard)

User dashboard with stats cards, quick actions, projects list with tabs, and activity feed.

### 3. Marketplace (/marketplace)

Browse projects with advanced filters (category, budget, status, date), search, and grid/list views.

### 4. Create Project (/create-project)

4-step wizard:

- **Step 1**: Basic Info (title, category, description, skills, files)
- **Step 2**: Milestones (define deliverables, amounts, timelines)
- **Step 3**: Budget & Terms (revenue split, IP license terms)
- **Step 4**: Review & Submit (transaction summary)

### 5. Project Detail (/project/:id)

Detailed project view with overview, milestone tracking, applications management, and blockchain info.

### 6. Profile (/profile)

User profile with 4 tabs: Portfolio (IP assets), Projects, Reviews, and Activity timeline.

### 7. IP Portfolio (/portfolio)

Comprehensive IP assets management with stats, grid view, search/filter, and genealogy modal.

## 🎨 Design System

### Color Palette (Tailwind Classes)

- **Backgrounds**: bg-slate-900, bg-slate-800, bg-gray-50, bg-white
- **Accents**: bg-emerald-600, bg-amber-600, bg-red-600, bg-cyan-600
- **Text**: text-slate-900, text-slate-600, text-slate-400, text-white
- **Borders**: border-gray-200, border-gray-300, border-slate-600

### Typography

- **Display**: text-5xl font-bold
- **H1**: text-4xl font-bold
- **H2**: text-3xl font-semibold
- **H3**: text-2xl font-semibold
- **Body**: text-base, text-lg, text-sm, text-xs

### Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

## 🔧 Key Components

### UI Components (src/components/ui/)

- **Button**: 4 variants, 3 sizes, loading/disabled states
- **Card**: Default, hover, interactive variants with optional header/footer
- **Badge**: 5 color variants with optional icons
- **Input**: With labels, helpers, errors, prefix/suffix icons
- **Modal**: Responsive with 5 size options
- **ProgressBar**: Multiple variants with percentage display

### Shared Components

- **WalletConnect**: Wallet connection dropdown with menu
- **IPAssetCard**: IP asset display with stats and actions

### Dashboard Components

- **StatsCard**: Stats with icons, trends, and subtext
- **ProjectCard**: Project cards with progress bars and collaborator info
- **ActivityFeed**: Timeline with upcoming milestones and recent activity

### Project Components

- **MilestoneCard**: Milestone details with status-based styling and actions
- **ApplicationCard**: Applicant profiles with approve/reject/message actions

## 🚦 Routing

```javascript
/                    → Landing Page
/dashboard           → User Dashboard
/marketplace         → Browse Projects
/create-project      → Create New Project
/project/:id         → Project Details
/profile             → User Profile
/portfolio           → IP Portfolio
```

## 📱 Responsive Design

All pages are fully responsive with:

- Mobile-first approach
- Hamburger menu on mobile
- Flexible grid systems
- Touch-optimized interfaces
- Adaptive typography

## 🎯 Features Implementation

### ✅ Completed Features

- All 7 pages fully implemented
- Complete component library
- React Router navigation
- Responsive layouts
- Tailwind CSS styling
- Interactive forms
- Modal dialogs
- Toast notifications
- Search and filtering
- Tabs and navigation

### 🔄 Ready for Integration

- Wallet connection (Web3 integration)
- Smart contract interactions
- Story Protocol IP registration
- Blockchain transaction signing
- Real-time data updates
- File upload to IPFS
- Payment processing

## 🎨 Customization

To customize the theme:

1. Edit `tailwind.config.js` for colors and spacing
2. Modify component variants in `/src/components/ui/`
3. Update design tokens in component classes

## 📝 Code Quality

- **100% Tailwind CSS** - No custom CSS files
- **Lucide React Icons** - Consistent icon library
- **Reusable Components** - DRY principle
- **Props Validation** - Default props and types
- **Clean Code** - Well-structured and commented

## 🔗 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [React Router](https://reactrouter.com)
- [Story Protocol](https://www.story.foundation)

## 📞 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using React + Vite + Tailwind CSS
