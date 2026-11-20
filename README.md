# ResumeAI — Frontend

React frontend for the ResumeAI application.

## Tech Stack

- Vite + React 18
- Tailwind CSS (dark/light mode)
- React Router v6
- Axios
- jsPDF
- react-hot-toast
- date-fns
- Lucide React

## Project Structure

```
src/
├── components/
│   ├── common/       # Navbar, ProtectedRoute, ProfileDropdown
│   ├── dashboard/    # Overview stats, resume grid, drafts list
│   ├── landing/      # Landing page sections
│   ├── resume/       # Resume builder components and steps
│   ├── analyze/      # Analysis result components
│   ├── sidebar/      # Sidebar and navigation
│   └── ui/           # Reusable primitives (Button, Input, Modal...)
├── layouts/          # AppLayout, LandingLayout, PublicLayout
├── pages/            # Route-level components
├── context/          # Auth context
├── hooks/            # Custom hooks
├── services/         # API calls (api.js)
├── utils/            # PDF export, validation, date formatting
└── constants/        # App-wide constants
```

## Getting Started

### Prerequisites

- Node.js v18+
- Backend running at http://localhost:5000

### Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

### Scripts

| Script                 | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the development server       |
| `npm run build`        | Production build to `dist/`        |
| `npm run preview`      | Serve the production build locally |
| `npm run lint`         | Run ESLint                         |
| `npm run format`       | Format with Prettier               |
| `npm run format:check` | Check formatting with Prettier     |

## Environment Variables

| Variable       | Description                                           |
| -------------- | ----------------------------------------------------- |
| `VITE_API_URL` | Backend API URL (default `http://localhost:5000/api`) |

## Features

- Landing page with hero, about, how it works, features, FAQ and footer
- Register and login with JWT auth
- 6-step resume builder (contact, summary, experience, education, skills, projects)
- Import existing resume from PDF, DOCX or Markdown
- AI-powered resume analysis with match score, missing keywords, strengths and suggestions
- Analysis history per resume
- PDF export of resume and analysis
- Draft system with localStorage persistence
- Light and dark mode with system preference detection
- Responsive layout with collapsible sidebar
- WCAG 2.1 AA accessible

## Pages

| Route                   | Description                      |
| ----------------------- | -------------------------------- |
| `/`                     | Landing page                     |
| `/login`                | Login                            |
| `/register`             | Register                         |
| `/dashboard`            | Overview with stats and activity |
| `/dashboard/resumes`    | Resume list                      |
| `/dashboard/drafts`     | Saved drafts                     |
| `/resume/new`           | Create resume                    |
| `/resume/:id/edit`      | Edit resume                      |
| `/resume/:id/analyze`   | Analyze resume                   |
| `/analyze`              | Pick a resume to analyze         |
| `/privacy-policy`       | Privacy policy                   |
| `/terms-and-conditions` | Terms and conditions             |

## Deployment

Recommended:

- Frontend: Vercel
- Set `VITE_API_URL` to your deployed backend URL
- Add a rewrite that serves `index.html` for every route, so links like `/dashboard` work on refresh

## Documentation

Planning docs live in [`docs/`](docs): functional and non-functional requirements, design system, user flow, component tree, API contracts, state management and error handling.
