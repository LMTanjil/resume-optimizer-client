# ResumeAI — Resume Optimizer Client

Frontend for ResumeAI. Build resumes with a 6-step builder, analyze them against job descriptions, and export the resume plus its analysis as a PDF.

## Stack

- Vite 5 + React 18 (plain JavaScript)
- React Router v6 (`createBrowserRouter`)
- Tailwind CSS 3.4 (class-based dark mode, CSS-variable color tokens)
- Axios, jsPDF (loaded on demand), lucide-react, react-hot-toast, date-fns

## Prerequisites

- Node.js **18+** (see `.nvmrc`)
- The Resume Optimizer backend running and reachable at `VITE_API_URL`.
  Registration sends a `name` field. The backend must include the `users.name` change described in [docs/api-contracts.md §2.1](docs/api-contracts.md).

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev
```

## Scripts

| Script                 | What it does                       |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the dev server               |
| `npm run build`        | Production build to `dist/`        |
| `npm run preview`      | Serve the production build locally |
| `npm run lint`         | ESLint                             |
| `npm run format`       | Prettier (write)                   |
| `npm run format:check` | Prettier (check only)              |

## Environment

| Variable       | Example                     |
| -------------- | --------------------------- |
| `VITE_API_URL` | `http://localhost:5000/api` |

## Folder structure

```
src/
├── components/   common · ui · sidebar · landing · dashboard · resume (+ steps) · analyze
├── layouts/      AppLayout (sidebar app), LandingLayout (marketing), PublicLayout (auth + legal)
├── pages/        Landing, PrivacyPolicy, TermsAndConditions, Login, Register,
│                 Dashboard (Overview), MyResumes, Drafts, ResumeNew, ResumeEdit, Analyze,
│                 AnalyzePicker, Logout, NotFound
├── context/      AuthContext (the only context)
├── hooks/        useAuth, useResumeForm, useUnsavedChanges, useDrafts, useGreeting, usePageTitle,
│                 useResumesWithAnalyses
├── services/     api.js (every backend call)
├── utils/        validation, resumeData, exportPdf, dateUtils, apiError, authEvents, user, focus,
│                 stats, async
├── constants/    limits, messages, steps, storage keys, greetings
├── router.jsx    route config
├── App.jsx       RouterProvider + Toaster
└── main.jsx      ErrorBoundary → AuthProvider → App
```

Architecture: **Pages → Components → Services (`api.js`) → Backend**. Pages fetch data and own page state. Components get data through props and never call the API.

## Documentation

All planning docs live in [`docs/`](docs):

- [Functional requirements](docs/functional-requirements.md)
- [Non-functional requirements](docs/non-functional-requirements.md)
- [Design system](docs/design.md)
- [User flow](docs/user-flow.md)
- [Component tree](docs/component-tree.md)
- [API contracts](docs/api-contracts.md)
- [State management](docs/state-management.md)
- [Error handling](docs/error-handling.md)
- [Greeting messages](docs/greeting-messages.md)
- [Original spec](docs/resume-optimizer-frontend-spec.md)
