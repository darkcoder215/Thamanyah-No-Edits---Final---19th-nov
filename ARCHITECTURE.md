# Thamanyah Web Tools - Architecture Reference

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Project Type** | Full-stack Next.js 16 Web Application |
| **Purpose** | HR Management Tool (offer letters, salary calculations) |
| **Language** | TypeScript, React 19 |
| **Package Manager** | pnpm 10.12.4 |
| **Target Users** | @thmanyah.com email domain only |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── actions/                  # Server Actions
│   │   └── spreadsheet.ts        # Google Sheets API
│   ├── (HR)/                     # Route group for HR pages
│   │   ├── job-offer/            # Job offer form page
│   │   └── freelancer-offer/     # Freelancer offer page
│   ├── dashboard/                # Dashboard page
│   ├── offer/                    # Offer selection page
│   ├── temp-offer/               # Temp offer page
│   ├── salary-calculator/        # Salary calculator page
│   └── manage-advertisers/       # Admin page
│
├── components/                   # React Components
│   ├── Form/                     # Shared form components
│   │   ├── BasicInfo.tsx
│   │   ├── SalaryInfo.tsx
│   │   ├── ExpectationsAndTargets.tsx
│   │   ├── ExportImportBtn.tsx
│   │   └── JobOfferFormTypes.ts  # TypeScript interfaces
│   ├── JobOffer/                 # Job offer components
│   │   ├── JobOfferForm.tsx
│   │   ├── JobOfferPreview.tsx
│   │   └── Preview/
│   ├── TempOffer/                # Temp offer components
│   │   ├── TempOfferForm.tsx
│   │   ├── TempOfferPreview.tsx
│   │   └── Preview/
│   ├── FreelancerOffer/          # Freelancer components
│   │   ├── FreelancerOfferForm.tsx
│   │   ├── FreelancerOfferPreview.tsx
│   │   └── Preview/
│   ├── salary-calculator/        # Salary calculator
│   │   ├── CalculatorPage.tsx
│   │   └── salary-data.ts
│   ├── manage-advertisers/       # Admin components
│   │   ├── ManageAdvertisers.tsx
│   │   ├── AdvertiserForm.tsx
│   │   └── lib/
│   ├── Login.tsx                 # Login UI
│   └── ProtectedComponent.tsx    # User info display
│
├── layout/                       # Layout components
│   ├── AntdLayout.tsx           # Theme & RTL config
│   └── DefaultLayout.tsx        # Auth wrapper
│
├── lib/                          # Core libraries
│   ├── context/
│   │   └── AuthContext.tsx      # Auth state management
│   └── firebase/
│       ├── firebaseConfig.ts    # Firebase init
│       └── auth.ts              # Auth functions
│
└── utils/
    └── helpers.ts               # Utility functions

public/
├── fonts/thmanyah/              # Custom fonts
│   ├── display/
│   ├── serif-text/
│   └── sans/
└── [images and icons]
```

---

## Core Modules

### 1. Authentication Module
**Location:** `src/lib/`

| File | Purpose |
|------|---------|
| `context/AuthContext.tsx` | React Context for auth state, `useAuth()` hook |
| `firebase/auth.ts` | Firebase auth functions, domain validation |
| `firebase/firebaseConfig.ts` | Firebase app initialization |

**Key Functions:**
- `signInWithGoogle()` - Google OAuth with @thmanyah.com restriction
- `signOutUser()` - Logout
- `subscribeToAuthChanges()` - Auth state listener
- `isCompanyEmail()` - Domain validation

### 2. Job Offer Module
**Location:** `src/components/JobOffer/`

Multi-step form for full-time employment offers:
- Step 1: BasicInfo (employee details, job info)
- Step 2: ExpectationsAndTargets (responsibilities)
- Step 3: SalaryInfo (compensation breakdown)

**Data Flow:**
```
JobOfferForm.tsx → [BasicInfo, ExpectationsAndTargets, SalaryInfo] → JobOfferPreview.tsx
```

### 3. Temp Offer Module
**Location:** `src/components/TempOffer/`

Form for temporary assignment contracts:
- TempOfferFields (basic info)
- ExpectationsField (duties)
- TempOfferPreview (A4 document)

### 4. Freelancer Offer Module
**Location:** `src/components/FreelancerOffer/`

Form for freelancer contracts:
- BasicInfoFields (personal/project info)
- DutiesField (responsibilities)
- BankDetailsFields (payment info)
- FreelancerOfferPreview (contract document)

### 5. Salary Calculator Module
**Location:** `src/components/salary-calculator/`

Interactive calculator with:
- Department/career path selection
- Level selection (managerial vs technical tracks)
- Regional adjustments
- Saudi nationality bonus
- Manager adjustment percentage
- Riyadh relocation bonus

### 6. Advertiser Management Module
**Location:** `src/components/manage-advertisers/`

Admin interface for linking posts to advertisers:
- Data from Google Sheets → Supabase
- CRUD operations via Supabase client

---

## Data Models

### TypeScript Interfaces
**Location:** `src/components/Form/JobOfferFormTypes.ts`

```typescript
// Job Offer Form
interface JobOfferFormData {
  offerType, theme, name, email, jobTitle, workType,
  directManager, team, department, level,
  expectations[], targets[], salary info,
  contractType, managerSignName
}

// Temp Offer Form
interface TempJobOfferFormData {
  name, email, jobTitle, directManager, duration,
  team, department, expectations[], netSalary, formType
}

// Freelancer Offer Form
interface FreelancerOfferFormData {
  name, email, jobTitle, managerName/Email, projectName,
  nationalNumber, phoneNumber, contractDuration,
  duties[], bankName, iban, salary, gender
}
```

### Database Schema (Supabase)
```sql
advertisers
├── id (UUID, PK)
└── name (TEXT)

posts
├── id (UUID, PK)
├── postId (TEXT)
├── title (TEXT)
├── productHandle (TEXT)
├── productName (TEXT)
└── advertiserId (UUID, FK → advertisers.id)
```

---

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `page.tsx` | Home (greeting) |
| `/dashboard` | `ProtectedComponent` | User info |
| `/offer` | `SelectForm` | Offer type selection |
| `/job-offer` | `JobOfferForm` | Job offer creation |
| `/temp-offer` | `TempOfferForm` | Temp assignment form |
| `/freelancer-offer` | `FreelancerOfferForm` | Freelancer contract |
| `/salary-calculator` | `CalculatorPage` | Salary calculation |
| `/manage-advertisers` | `ManageAdvertisers` | Admin panel |

---

## Tech Stack

### Core
- **Next.js** 16.0.1 - React framework
- **React** 19.2.0 - UI library
- **TypeScript** 5.9.3 - Type safety

### UI & Styling
- **Ant Design** 5.28.0 - Component library
- **Tailwind CSS** 4.1.17 - Utility CSS
- RTL support with Arabic locale

### Backend Services
- **Firebase** 12.5.0 - Authentication
- **Supabase** 2.80.0 - PostgreSQL database
- **Google Sheets API** - External data source

### Development
- **ESLint** 9.39.1 - Linting
- **Prettier** 3.6.2 - Formatting
- **Husky** 9.1.7 - Git hooks

---

## Data Flow Patterns

### Authentication Flow
```
Login.tsx → useAuth() → AuthContext.tsx → firebase/auth.ts → Firebase
```

### Form Submission Flow
```
Form Component (multi-step)
    ↓
setIsSubmitted(true)
    ↓
Preview Component (A4 document)
    ↓
Browser Print-to-PDF
```

### Admin Data Flow
```
Google Sheets
    ↓
spreadsheet.ts (Server Action)
    ↓
Supabase Database
    ↓
ManageAdvertisers.tsx (Client)
```

---

## Styling System

### Theme Configuration
**Location:** `src/layout/AntdLayout.tsx`

- Dark mode with localStorage persistence
- RTL direction for Arabic
- Primary color: #fa541c (orange)
- Arabic locale (ar_EG)

### Custom Fonts
**Location:** `public/fonts/thmanyah/`

- IBM Plex Sans Arabic
- Thmanyah Display
- Thmanyah Serif Text
- Thmanyah Sans

### A4 Document Styling
**Location:** `src/app/globals.css`

- `.page`, `.page-2` classes for A4 pages
- Print media queries
- League theme (`.theme-league`)

---

## Environment Variables

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Authentication
NEXT_PUBLIC_PASS_LOGIN          # Bypass auth for dev

# Google Sheets API
PROJECT_ID
PRIVATE_KEY
CLIENT_EMAIL
NEXT_PUBLIC_POSTS_SPREADSHEET_ID
NEXT_PUBLIC_POSTS_SHEET_RANGE

# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Key Architectural Decisions

### 1. Domain-Based Authentication
- Restricts access to @thmanyah.com emails
- Validation at Firebase SDK level (client-side)

### 2. Client-Side Form State
- All form data in React state
- No automatic backend persistence
- JSON export/import for data portability

### 3. Dual Theme System
- Standard Ant Design theme
- Special "League" theme for sports offers

### 4. A4 Document Generation
- CSS-based rendering (no PDF library)
- Browser print-to-PDF
- Thmanyah brand fonts

### 5. Multi-Backend Integration
- Firebase: Authentication
- Supabase: Relational data
- Google Sheets: External data source

---

## Common Development Tasks

### Adding a New Form Field
1. Update type in `src/components/Form/JobOfferFormTypes.ts`
2. Add input in relevant form component (`BasicInfo.tsx`, etc.)
3. Display in preview component
4. Update export/import in `ExportImportBtn.tsx`

### Adding a New Page
1. Create directory in `src/app/`
2. Add `page.tsx` with component
3. Component goes in `src/components/`
4. Update navigation if needed

### Adding a New Offer Type
1. Create component directory in `src/components/`
2. Create form and preview components
3. Add type interface in `JobOfferFormTypes.ts`
4. Create route in `src/app/`
5. Add to offer selection in `SelectForm.tsx`

### Modifying Salary Calculator
1. Edit `src/components/salary-calculator/salary-data.ts` for data
2. Edit `CalculatorPage.tsx` for logic/UI

---

## File Locations Quick Reference

| What | Where |
|------|-------|
| Auth context | `src/lib/context/AuthContext.tsx` |
| Firebase config | `src/lib/firebase/firebaseConfig.ts` |
| Form types | `src/components/Form/JobOfferFormTypes.ts` |
| Salary data | `src/components/salary-calculator/salary-data.ts` |
| Global styles | `src/app/globals.css` |
| Theme config | `src/layout/AntdLayout.tsx` |
| Server actions | `src/app/actions/` |
| Supabase queries | `src/components/manage-advertisers/lib/` |

---

## Security Notes

- Domain validation is client-side only
- Ensure Firebase Security Rules are configured
- Use Supabase RLS for row-level security
- Keep `.env.local` in `.gitignore`
- Service account credentials should be protected

---

## Build & Deployment

### Scripts
```bash
pnpm dev          # Development with Turbopack
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
```

### Deployment Requirements
- Firebase credentials
- Supabase credentials
- Google Sheets API credentials
- Node.js environment

---

*Last Updated: November 2024*
