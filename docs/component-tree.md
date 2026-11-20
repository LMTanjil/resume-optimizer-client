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
│   │   │   ├── DashboardTabs.jsx       # Resumes | Drafts (ARIA tabs)
│   │   │   ├── DraftsBanner.jsx
│   │   │   ├── ResumeGrid.jsx          # grid + skeleton + empty state for resumes
│   │   │   ├── DraftList.jsx           # grid + empty state for drafts
│   │   │   ├── DraftCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── tabIds.js               # shared tab/panel id helpers
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
│   │   └── analyze/
│   │       ├── AnalyzeForm.jsx
│   │       ├── AnalyzeResult.jsx
│   │       ├── ScoreBar.jsx
│   │       ├── TagGroup.jsx            # heading + list of Tags + empty text
│   │       ├── SuggestionsList.jsx
│   │       ├── AnalysisDetails.jsx     # keywords + strengths + suggestions (result and history rows)
│   │       ├── scoreColor.js           # score → color class, clamp
│   │       ├── AnalysisHistory.jsx
│   │       └── AnalysisHistoryRow.jsx
│   ├── layouts/
│   │   ├── AuthLayout.jsx              # skip link + Navbar(authenticated) + <main><Outlet/>
│   │   └── PublicLayout.jsx            # skip link + Navbar(public) + <main><Outlet/>
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ResumeNew.jsx
│   │   ├── ResumeEdit.jsx
│   │   ├── Analyze.jsx
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
/                          → RootRedirect (inline: <Navigate> based on useAuth)
PublicLayout
├── GuestRoute
│   ├── /login             → Login       (lazy)
│   └── /register          → Register    (lazy)
└── *                      → NotFound    (lazy)
ProtectedRoute
├── /logout                → Logout      (not lazy)
└── AuthLayout
    ├── /dashboard         → Dashboard   (lazy)
    ├── /resume/new        → ResumeNew   (lazy)
    ├── /resume/:id/edit   → ResumeEdit  (lazy)
    └── /resume/:id/analyze→ Analyze     (lazy)
```

Each layout wraps `<Outlet/>` in `<Suspense fallback={<Spinner page/>}>`.

---

## 3. Layouts

```
AuthLayout
├── skip link
├── Navbar variant="authenticated"
│   ├── Link "ResumeAI" → /
│   ├── ThemeToggle
│   ├── <span> user email (hidden < md)
│   ├── Button secondary "New Resume" (iconOnly < md)   → on /resume/new: dispatch NEW_RESUME_EVENT; else navigate("/resume/new")
│   └── Button ghost "Logout" (iconOnly < md)          → navigate("/logout")
└── <main id="main"> container (max-w-content)
    └── Outlet

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

### Dashboard

```
Dashboard  (state: resumes, status, activeTab, deleteTarget, deleting; useDrafts(user.id))
├── header: h1 "Dashboard"
├── DraftsBanner           (if showBanner)        props: count, onView, onDismiss
├── DashboardTabs          props: activeTab, onChange, draftCount
├── [tab = resumes]
│   ├── ErrorPanel         (if status = error)    props: message, onRetry
│   └── ResumeGrid         props: resumes, loading, onAnalyze, onEdit, onDelete
│       ├── Skeleton ×6    (loading)
│       ├── EmptyState     (empty)                props: message, actionLabel, onAction
│       └── ResumeCard ×N  props: resume, onAnalyze, onEdit, onDelete
│           ├── Link (title, stretched → edit)
│           ├── "Created {relative}"
│           └── Button Analyze · Button Edit · Button Delete
├── [tab = drafts]
│   └── DraftList          props: drafts, onRestore, onDiscard
│       ├── EmptyState     ("No unsaved drafts.")
│       └── DraftCard ×N   props: draft, onRestore, onDiscard
└── ConfirmModal (delete)  props: open, title, body, confirmLabel, variant="destructive", loading, onConfirm, onCancel
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
