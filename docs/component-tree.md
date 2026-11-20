# Component Tree

The full component breakdown, folder structure and parent/child relationships. This extends the base spec's folder structure ([resume-optimizer-frontend-spec.md](resume-optimizer-frontend-spec.md) → "Folder Structure").
Related: [state-management.md](state-management.md) · [design.md](design.md) · [functional-requirements.md](functional-requirements.md)

**Rules (from the spec and the interview):**

- Pages fetch data and own page state. Components receive props and **never call the API**.
- Context is for auth only.
- Components: PascalCase `.jsx`, default export. Hooks and utils: camelCase `.js`, named exports.
- No barrel files.

---

## 1. Folder structure

The project is scaffolded directly into the current folder (`ro-fontend`).

```
ro-fontend/
├── docs/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx              # variant: "authenticated" | "public"
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── GuestRoute.jsx          # redirects authed users away from /login, /register
│   │   │   ├── ErrorBoundary.jsx       # class component, root crash fallback
│   │   │   ├── ConfirmModal.jsx        # Delete + Discard dialogs (built on ui/Modal)
│   │   │   ├── ErrorPanel.jsx          # inline error + Retry
│   │   │   ├── BackLink.jsx            # "← Back to dashboard"
│   │   │   ├── SkipLink.jsx            # "Skip to main content"
│   │   │   └── AuthCard.jsx            # shared frame for Login / Register
│   │   ├── ui/
│   │   │   ├── Button.jsx              # variant: primary | secondary | destructive | ghost; loading; iconOnly
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx            # optional counter (value length / max)
│   │   │   ├── FormField.jsx           # label + control slot + error (aria wiring)
│   │   │   ├── Modal.jsx               # focus trap, Esc, return focus, inert background
│   │   │   ├── Tag.jsx                 # variant: neutral | warning | success; onRemove
│   │   │   ├── Skeleton.jsx
│   │   │   └── Spinner.jsx
│   │   ├── dashboard/
│   │   │   ├── DraftsBanner.jsx
│   │   │   ├── ResumeGrid.jsx          # grid + skeleton + empty state for resumes
│   │   │   ├── OverviewPanel.jsx       # Overview: stats + recent activity + quick actions
│   │   │   ├── OverviewStats.jsx       # 3 StatCards + "may be incomplete" note
│   │   │   ├── StatCard.jsx
│   │   │   ├── RecentActivity.jsx      # last 5 resumes, compact rows
│   │   │   ├── QuickActions.jsx        # Create Resume / Import Resume link cards
│   │   │   ├── DraftList.jsx           # grid + empty state for drafts
│   │   │   ├── DraftCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   ├── resume/
│   │   │   ├── ResumeCard.jsx
│   │   │   ├── ResumeStepForm.jsx      # orchestrates steps, validation, save, blocker, draft hookup
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── StepActions.jsx         # Cancel / Back / Save / Next bar
│   │   │   ├── ImportResumeButton.jsx  # "Import existing resume" + hidden file input
│   │   │   ├── ArrayEntryCard.jsx
│   │   │   ├── BulletListEditor.jsx
│   │   │   ├── TagInput.jsx
│   │   │   └── steps/
│   │   │       ├── ContactStep.jsx
│   │   │       ├── BasicInfoStep.jsx
│   │   │       ├── ExperienceStep.jsx
│   │   │       ├── EducationStep.jsx
│   │   │       ├── SkillsStep.jsx
│   │   │       └── ProjectsStep.jsx
│   │   ├── sidebar/
│   │   │   ├── Sidebar.jsx             # nav items, collapse toggle, mobile drawer + backdrop
│   │   │   └── SidebarItem.jsx         # NavLink: icon, label, path, collapsed (+ isActive override)
│   │   ├── landing/
│   │   │   ├── LandingNavbar.jsx       # anchors, Login / Get Started, mobile menu
│   │   │   ├── Hero.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── FAQ.jsx                 # <details> accordion
│   │   │   └── Footer.jsx
│   │   └── analyze/
│   │       ├── AnalyzeForm.jsx
│   │       ├── AnalyzeResult.jsx
│   │       ├── ScoreBar.jsx
│   │       ├── TagGroup.jsx            # heading + list of Tags + empty text
│   │       ├── SuggestionsList.jsx
│   │       ├── AnalysisDetails.jsx     # keywords + strengths + suggestions (result and history rows)
│   │       ├── scoreColor.js           # score → color class, clamp
│   │       ├── AnalysisHistory.jsx
│   │       ├── AnalysisHistoryRow.jsx
│   │       └── ResumePickerCard.jsx    # /analyze card: created, last analyzed, Analyze
│   ├── layouts/
│   │   ├── AppLayout.jsx               # grid: Sidebar | Navbar(authenticated) / <main><Outlet/>
│   │   ├── LandingLayout.jsx           # LandingNavbar + <main><Outlet/> + Footer
│   │   └── PublicLayout.jsx            # skip link + Navbar(public) + <main><Outlet/>
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── TermsAndConditions.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx               # /dashboard (Overview)
│   │   ├── MyResumes.jsx               # /dashboard/resumes
│   │   ├── Drafts.jsx                  # /dashboard/drafts
│   │   ├── ResumeNew.jsx
│   │   ├── ResumeEdit.jsx
│   │   ├── Analyze.jsx
│   │   ├── AnalyzePicker.jsx           # /analyze
│   │   ├── Logout.jsx
│   │   └── NotFound.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useResumeForm.js            # useReducer form state + validation glue
│   │   ├── useUnsavedChanges.js        # useBlocker + beforeunload
│   │   ├── useDrafts.js
│   │   ├── useGreeting.js              # time bands, weekends, holidays (Easter calc)
│   │   └── usePageTitle.js             # sets "{Page} · ResumeAI"
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── exportPdf.js
│   │   ├── validation.js
│   │   ├── dateUtils.js
│   │   ├── apiError.js
│   │   ├── authEvents.js
│   │   ├── resumeData.js               # API ⇄ form shape, payload, dirty snapshot, slugify
│   │   ├── user.js                     # getDisplayName
│   │   └── focus.js                    # focusSoon (focus newly added fields)
│   ├── constants/
│   │   └── index.js                    # limits, messages, steps, storage keys, timeouts, greetings
│   ├── router.jsx                      # createBrowserRouter config
│   ├── App.jsx                         # <RouterProvider> + <Toaster>
│   ├── main.jsx                        # ErrorBoundary > AuthProvider > App
│   └── index.css                       # Tailwind layers + CSS color variables + reduced-motion rule
├── .env / .env.example
├── .gitignore  .nvmrc  .prettierrc  .prettierignore
├── eslint.config.js  postcss.config.js  tailwind.config.js  vite.config.js
├── index.html                          # Inter font link + theme init script
├── package.json
└── README.md
```

Greeting message data lives in `constants/index.js` (`GREETINGS`). Its content is defined in [greeting-messages.md](greeting-messages.md).

---

## 2. App shell

```
main.jsx
└── ErrorBoundary
    └── AuthProvider
        └── App
            ├── RouterProvider (router.jsx)
            └── Toaster (react-hot-toast)
```

### router.jsx

```
LandingLayout
└── /                      → Landing     (lazy)
PublicLayout
├── GuestRoute
│   ├── /login             → Login       (lazy)
│   └── /register          → Register    (lazy)
├── /privacy-policy        → PrivacyPolicy       (lazy)
├── /terms-and-conditions  → TermsAndConditions  (lazy)
└── *                      → NotFound    (lazy)
ProtectedRoute
├── /logout                → Logout      (not lazy)
└── AppLayout
    ├── /dashboard         → Dashboard (Overview) (lazy)
    ├── /dashboard/resumes → MyResumes   (lazy)
    ├── /dashboard/drafts  → Drafts      (lazy)
    ├── /resume/new        → ResumeNew   (lazy)
    ├── /resume/:id/edit   → ResumeEdit  (lazy)
    ├── /analyze           → AnalyzePicker (lazy)
    └── /resume/:id/analyze→ Analyze     (lazy)
```

Each layout wraps `<Outlet/>` in `<Suspense fallback={<Spinner page/>}>`.

---

## 3. Layouts

```
AppLayout   (grid areas "sidebar navbar" / "sidebar content"; state: collapsed, mobileOpen)
├── skip link
├── Sidebar          props: collapsed, onToggleCollapsed, mobileOpen, onCloseMobile, closeButtonRef
│   ├── backdrop (mobile, when open)
│   ├── drawer header: Link "ResumeAI" + close button (mobile only)
│   ├── SidebarItem × 5  props: icon, label, path, collapsed, isActive?, onClick?
│   │   Overview (/dashboard) · My Resumes (/dashboard/resumes) ·
│   │   Create Resume (on /resume/new: dispatch NEW_RESUME_EVENT) ·
│   │   Analyze (/analyze) · Drafts (/dashboard/drafts)
│   └── collapse toggle (md and up)
├── Navbar variant="authenticated"   props: menuOpen, onOpenMenu, menuButtonRef
│   ├── Button ghost hamburger (< md) → open drawer
│   ├── Link "ResumeAI" → /dashboard
│   ├── ThemeToggle
│   └── ProfileDropdown   avatar → menu: name/email · Settings (toast) · Logout (/logout)
└── <main id="main"> container (max-w-content)
    └── Outlet

LandingLayout
├── skip link
├── LandingNavbar
├── <main id="main"> → Outlet (Landing: Hero · HowItWorks · Features · FAQ)
└── Footer

PublicLayout
├── skip link
├── Navbar variant="public"
│   ├── Link "ResumeAI" → /
│   └── ThemeToggle
└── <main id="main"> → Outlet
```

---

## 4. Pages

### Login / Register

```
Login                                   Register
├── usePageTitle("Log in")              ├── usePageTitle("Register")
└── form (card, max-w-md)               └── form (card, max-w-md)
    ├── FormField + Input (email)           ├── FormField + Input (name)
    ├── FormField + Input (password)        ├── FormField + Input (email)
    ├── Button primary "Log in"             ├── FormField + Input (password)
    └── "Don't have an account? Register"   ├── FormField + Input (confirm password)
                                            ├── Button primary "Create account"
                                            └── "Already have an account? Log in"
```

Both use `api.login`/`api.register`, then `useAuth().login`, `useGreeting()` → toast, and `navigate("/dashboard")`.

### Dashboard (Overview), My Resumes, Drafts

```
Dashboard (/dashboard)   useResumesWithAnalyses(), useDrafts(user.id)
├── h1 "Overview"
├── DraftsBanner           (if showBanner)        props: count, onDismiss  ("View drafts" → /dashboard/drafts)
└── OverviewPanel          props: resumes, status, loadError, analysesById, analysesStatus, onRetry
    ├── ErrorPanel         (if status = error)
    ├── OverviewStats → StatCard ×3
    ├── RecentActivity     (5 newest, Analyze → /resume/:id/analyze)
    └── QuickActions       (Create Resume, Import Resume → /resume/new)

MyResumes (/dashboard/resumes)   useResumesWithAnalyses({ withAnalyses: false }); state: deleteTarget, deleting
├── h1 "My Resumes"
├── ErrorPanel             (if status = error)    props: message, onRetry
├── ResumeGrid             props: resumes, loading, onDelete
│   ├── Skeleton ×6        (loading)
│   ├── EmptyState         (empty)
│   └── ResumeCard ×N      props: resume, onDelete
│       ├── Link (title, stretched → edit)
│       ├── "Created {relative}"
│       └── Button Analyze · Button Edit · Button Delete
└── ConfirmModal (delete)  props: open, title, body, confirmLabel, loading, onConfirm, onCancel

Drafts (/dashboard/drafts)   useDrafts(user.id)
├── h1 "Drafts"
└── DraftList              props: drafts, onRestore, onDiscard
    ├── EmptyState         ("No unsaved drafts.")
    └── DraftCard ×N       props: draft, onRestore, onDiscard
```

### ResumeNew / ResumeEdit

```
ResumeNew                                   ResumeEdit
├── usePageTitle("New Resume")              ├── usePageTitle("Edit Resume")
├── reads location.state.draftId            ├── fetches getResume(id) (+ draft from location.state)
├── builds initialData (name prefill        ├── Skeleton while loading; redirects on 404/403
│   or draft data)                          ├── builds initialData (fromResume or draft data)
└── ResumeStepForm mode="create" …          └── ResumeStepForm mode="edit" resumeId={id} …
```

The pages pass `onSave(payload)` to the form, and that callback calls the API. `ResumeStepForm` never imports `api.js`.

```
ResumeStepForm
  props: mode, resumeId, initialData, initialStep, draft (id, sessionKey) | null, onSave(payload) → Promise, resetSignal
  uses:  useResumeForm, useUnsavedChanges, useDrafts, useAuth, useLocation/useNavigate, authEvents
├── BackLink "Back to dashboard"
├── h1 "Create resume" | "Edit resume"
├── StepIndicator          props: steps, current
├── <section> fade wrapper (key = step)
│   ├── ContactStep        props: form, importer ({ importing, onFile } | null)
│   │   └── ImportResumeButton  props: importing, onFile
│   ├── BasicInfoStep      props: values, errors, onChange
│   ├── ExperienceStep     props: items, errors, onAdd, onRemove, onChange, onAddBullet, onUpdateBullet, onRemoveBullet
│   │   └── ArrayEntryCard ×N  props: title, onRemove, children
│   │       ├── FormField + Input (company, role, duration)
│   │       └── BulletListEditor  props: bullets, errors, onAdd, onUpdate, onRemove
│   ├── EducationStep      props: items, errors, onAdd, onRemove, onChange
│   │   └── ArrayEntryCard ×N → FormField + Input (institution, degree, year)
│   ├── SkillsStep         props: skills, onAdd, onRemove
│   │   └── TagInput       props: label, tags, max, onAdd, onRemove, error
│   └── ProjectsStep       props: items, errors, onAdd, onRemove, onChange, onAddTech, onRemoveTech
│       └── ArrayEntryCard ×N
│           ├── FormField + Input (name), Textarea (description, counter), Input (link)
│           └── TagInput (tech)
├── StepActions            props: mode, step, total, saving, busy, onCancel, onBack, onNext, onSave
└── ConfirmModal (discard) props: open = blocker.state === "blocked" | resetPending, title/body (draft vs normal)
```

### Analyze

```
Analyze  (state: resume, analyses, loadStatus, analysesStatus, analyzing, slow, jobDescription, exporting)
├── usePageTitle("Analyze")
├── BackLink "Back to dashboard"
├── header: h1 "Analyze: {title}" + Button secondary "Edit resume"
├── AnalyzeForm            props: value, onChange, onSubmit, loading, slow, min, max
│   ├── FormField + Textarea (counter "n / 5,000", helper "Minimum 50 characters")
│   ├── Button primary "Analyze" / "Analyzing…"
│   └── slow note
├── ErrorPanel             (if analyses failed) props: message, onRetry
├── AnalyzeResult          props: analysis | null, onExport, exporting
│   ├── ScoreBar           props: score
│   ├── "Analyzed {relative}"
│   ├── TagGroup "Missing keywords"  props: title, tags, variant="warning", emptyText
│   ├── TagGroup "Strengths"         props: …, variant="success"
│   ├── SuggestionsList    props: suggestions
│   └── Button secondary "Export PDF" (only if analysis)
└── AnalysisHistory        props: analyses (≤5)
    └── AnalysisHistoryRow ×N  props: analysis   (local state: open)
        ├── header button: date + score dot + "62%" + ChevronDown
        └── panel: TagGroup ×2 + SuggestionsList
```

`onExport` → `exportPdf(resume, current)` (it dynamically imports jsPDF).

### Logout / NotFound

```
Logout   → effect: logout(); toast("You've been logged out.") → <Navigate to="/login" replace/>
NotFound → usePageTitle("Page Not Found"); h1 + text + Link (dashboard | login by useAuth)
```

---

## 5. Shared UI primitives, prop reference

| Component    | Key props                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Button       | `variant`, `type`, `loading`, `loadingText`, `icon`, `iconOnly`, `aria-label`, `disabled`, `onClick`, `as` (Link support) |
| Input        | standard input props + `invalid`, `id`, `maxLength`                                                                       |
| Textarea     | standard props + `invalid`, `showCounter`, `maxLength`                                                                    |
| FormField    | `id`, `label`, `required`, `error`, `helper`, `children` (render function receiving aria props)                           |
| Modal        | `open`, `onClose`, `titleId`, `initialFocusRef`, `children`                                                               |
| ConfirmModal | `open`, `title`, `body`, `confirmLabel`, `cancelLabel`, `confirmVariant`, `loading`, `onConfirm`, `onCancel`              |
| Tag          | `variant`, `children`, `onRemove`                                                                                         |
| Skeleton     | `className`                                                                                                               |
| Spinner      | `size`, `page` (centered full-area)                                                                                       |
| ErrorPanel   | `message`, `onRetry`                                                                                                      |
| EmptyState   | `message`, `actionLabel`, `onAction`                                                                                      |
| BackLink     | `to`, `children`                                                                                                          |
