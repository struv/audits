# Audit Manager

A beautiful, modern audit management application for healthcare facilities. Built with obsessive attention to detail and delightful user experience.

## ✨ Features

- **Intuitive Dashboard** - View all audits at a glance with real-time progress tracking
- **Two Audit Types**:
  - **MRR** (Medical Record Review) - 59 comprehensive checklist items
  - **FSR** (Facility Site Review) - 136 detailed compliance checks
- **Smart Progress Tracking** - Auto-updates audit status based on completion
- **Calendar View** - Visual timeline of all scheduled audits
- **Beautiful Animations** - Smooth, delightful micro-interactions throughout
- **Mobile-First** - Fully responsive design for on-the-go auditing
- **Flexible Storage** - Works offline with localStorage or cloud-synced with Supabase

## 🎨 Design Philosophy

Built with the same obsessive attention to detail as Steve Jobs would demand:
- **Every pixel matters** - Refined shadows, spacing, and typography
- **Fluid animations** - Spring physics and natural motion
- **Touch-optimized** - 44px minimum tap targets for mobile use
- **Accessible** - Proper focus states and keyboard navigation
- **Fast** - Instant feedback, no loading spinners

## 🚀 Tech Stack

- **React 18** + **TypeScript** - Type-safe component architecture
- **Vite** - Lightning-fast dev server and builds
- **Tailwind CSS** - Custom design system with refined color palette
- **Zustand** - Minimal, fast state management
- **Framer Motion** - Buttery smooth animations
- **React Router** - Client-side routing
- **react-big-calendar** - Beautiful calendar interface
- **date-fns** - Modern date manipulation

## 📦 Installation

```bash
cd audit-manager
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🗄️ Supabase Setup (Optional)

The app works great with localStorage out of the box, but you can optionally use Supabase for cloud persistence and multi-device sync.

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API to get your credentials

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_USE_LOCAL_STORAGE=false  # Set to false to use Supabase
```

### 3. Run Database Migration

In your Supabase project dashboard:

1. Go to the SQL Editor
2. Copy the contents of `supabase/migrations/20250101000000_create_audits_table.sql`
3. Paste and run the SQL to create the `audits` table

### 4. Start the App

```bash
npm run dev
```

The app will automatically use Supabase when properly configured. If credentials are missing or `VITE_USE_LOCAL_STORAGE=true`, it falls back to localStorage.

### Switching Between localStorage and Supabase

To switch back to localStorage mode, set in `.env.local`:

```env
VITE_USE_LOCAL_STORAGE=true
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AuditCard.tsx      # Beautiful audit summary cards
│   ├── AuditForm.tsx      # Modal for creating audits
│   └── ChecklistView.tsx  # Interactive checklist with sections
├── pages/
│   ├── Dashboard.tsx      # Main dashboard with stats
│   ├── AuditDetail.tsx    # Full audit view with checklist
│   └── Calendar.tsx       # Calendar view of all audits
├── data/
│   └── templates/
│       ├── mrrChecklist.ts # MRR audit template
│       └── fsrChecklist.ts # FSR audit template
├── lib/
│   ├── store.ts           # Zustand state management
│   ├── dataStore.ts       # localStorage abstraction
│   └── utils.ts           # Helper functions
├── types/
│   └── index.ts           # TypeScript definitions
└── App.tsx                # Routing & app initialization
```

## 📱 Usage

### Creating an Audit

1. Click **"New Audit"** on the dashboard
2. Select a location from the dropdown
3. Choose audit type (MRR or FSR)
4. Pick a scheduled date
5. Click **"Create Audit"**

### Completing Checklists

1. Open an audit from the dashboard
2. Expand sections by clicking the header
3. Tap checkboxes to mark items complete
4. Progress updates automatically
5. Audit status updates based on completion:
   - **Pending** → 0% complete
   - **In Progress** → 1-99% complete
   - **Complete** → 100% complete

### Calendar View

- Click **"Calendar"** to see all audits visually
- Blue events = MRR audits
- Purple events = FSR audits
- Green events = Completed audits
- Click any event to jump to that audit

## 🎯 Key Design Decisions

### Why localStorage (with Supabase option)?

- **Zero infrastructure** - Works immediately without backend
- **Fast** - No network latency with localStorage
- **Private** - Data stays on user's device (or synced to Supabase)
- **Flexible** - Switch between localStorage and Supabase with one env variable
- **Migration-ready** - Clean abstraction layer for easy backend swapping

### Why Zustand over Redux?

- **Minimal boilerplate** - 10x less code
- **Better performance** - Optimized re-renders
- **Simple API** - Easy to understand and test
- **Small bundle** - <1KB vs. Redux's ~15KB

### Why Framer Motion?

- **Natural physics** - Spring animations feel alive
- **Layout animations** - Smooth transitions between states
- **Gesture support** - Built-in swipe and drag
- **Great DX** - Declarative API

## 🔮 Future Enhancements

1. **Supabase Enhancements**
   - Real-time collaboration with live updates
   - User authentication and multi-user support
   - Row-level security for team access
   - Automatic cloud backup

2. **Advanced Features**
   - Photo attachments for checklist items
   - Notes and annotations
   - Export to PDF
   - Email reports
   - Team assignments

3. **Analytics**
   - Completion trends
   - Location performance
   - Time tracking
   - Compliance scoring

## 📊 Data Schema

### Audit Object
```typescript
interface Audit {
  id: string;
  location: LocationId;
  auditType: 'MRR' | 'FSR';
  scheduledDate: string; // ISO 8601
  status: 'pending' | 'in_progress' | 'complete';
  checklistItems: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}
```

### localStorage Keys
- `audits` - Array of all audit objects
- `app_metadata` - Version and last modified timestamp

## 🎨 Color System

- **Primary** (Blue) - MRR audits, primary actions
- **Accent** (Purple) - FSR audits, secondary actions
- **Success** (Green) - Completed items, positive states
- **Warning** (Amber) - In-progress, attention needed
- **Neutral** (Gray) - Base UI, text, borders

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Build for Production
```bash
npm run build
# Outputs to /dist
```

## 📝 License

MIT - Built with ❤️ for healthcare professionals

---

**Note**: This is an MVP designed for rapid deployment. All data is stored locally. For production use with multiple users, integrate with PocketBase or similar backend.
