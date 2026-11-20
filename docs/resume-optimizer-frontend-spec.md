# Resume Optimizer — Frontend Spec

## Project Info

- **Repo name:** `resume-optimizer-client`
- **Stack:** Vite + React, Tailwind CSS, React Router v6, Axios, jsPDF
- **Language:** JavaScript only, no TypeScript

---

## Architecture Pattern

```
Pages → Components → Services (api.js) → Backend API
```

- **Pages** — route-level components, handle page state and data fetching
- **Components** — reusable UI pieces, receive props, no direct API calls
- **Services** — all axios calls live in `api.js` only
- **Context** — global auth state only

---

## Folder Structure

```
resume-optimizer-client/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── resume/
│   │   │   ├── ResumeCard.jsx           # card shown on dashboard
│   │   │   ├── ResumeStepForm.jsx       # multi-step builder
│   │   │   └── StepIndicator.jsx        # shows current step progress
│   │   └── analyze/
│   │       ├── AnalyzeForm.jsx          # job description input
│   │       └── AnalyzeResult.jsx        # match score + suggestions
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx                # list of saved resumes
│   │   ├── ResumeNew.jsx                # create resume page
│   │   ├── ResumeEdit.jsx               # edit existing resume
│   │   └── Analyze.jsx                  # analyze page
│   ├── context/
│   │   └── AuthContext.jsx              # global auth state
│   ├── hooks/
│   │   └── useAuth.js                   # consume auth context
│   ├── services/
│   │   └── api.js                       # all axios calls in one place
│   ├── utils/
│   │   └── exportPdf.js                 # jsPDF export logic
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
└── index.html
```

---

## Environment Variables

**.env**

```
VITE_API_URL=http://localhost:5000/api
```

**.env.example**

```
VITE_API_URL=http://localhost:5000/api
```

---

## Routing

```
/                    → redirect to /dashboard if logged in, else /login
/login               → Login page
/register            → Register page
/dashboard           → protected — list of user's resumes
/resume/new          → protected — multi-step resume builder
/resume/:id/edit     → protected — edit existing resume
/resume/:id/analyze  → protected — analyze page
```

All protected routes wrap with `ProtectedRoute.jsx`. If no token, redirect to `/login`.

---

## Auth Context — `AuthContext.jsx`

Manages global auth state across the app:

```js
{
  user: null,           // { id, email } decoded from JWT
  token: null,          // JWT string
  login(token, user),   // saves to state + localStorage
  logout(),             // clears state + localStorage
  isAuthenticated       // boolean
}
```

On app load, read token from localStorage and restore state automatically.

---

## API Service — `api.js`

Single axios instance. All API functions exported from this file only:

```js
import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// Auth
export const register = (email, password) => api.post("/auth/register", { email, password })
export const login = (email, password) => api.post("/auth/login", { email, password })

// Resumes
export const getResumes = () => api.get("/resumes")
export const getResume = (id) => api.get(`/resumes/${id}`)
export const createResume = (data) => api.post("/resumes", data)
export const updateResume = (id, data) => api.put(`/resumes/${id}`, data)
export const deleteResume = (id) => api.delete(`/resumes/${id}`)

// Analyze
export const analyzeResume = (resumeId, jobDescription) =>
  api.post("/analyze", { resumeId, jobDescription })
export const getAnalyses = (resumeId) => api.get(`/analyze/${resumeId}`)
```

---

## Multi-Step Resume Builder

5 steps, one section at a time. Show `StepIndicator` at the top showing current step.

```
Step 1 — Basic Info    (title, summary)
Step 2 — Experience    (company, role, duration, bullet points)
Step 3 — Education     (institution, degree, year)
Step 4 — Skills        (add/remove skill tags)
Step 5 — Projects      (name, description, tech stack, link)
```

Rules:

- Each step has Next and Back buttons
- Step 1 has only Next, Step 5 has Back and Save Resume
- Array fields (experience, education, projects) have Add and Remove per entry
- Skills shown as removable tags with an input + Add button
- On Save, call `createResume` or `updateResume` depending on whether it's new or edit

---

## Pages

### Dashboard

- Fetch all resumes on mount
- Show each as a `ResumeCard` with title, created date
- Each card has: Edit, Analyze, Delete buttons
- Delete shows a confirm dialog before calling API
- Empty state message if no resumes yet

### ResumeNew

- Renders `ResumeStepForm` in create mode
- On save redirect to `/dashboard`

### ResumeEdit

- Fetch resume by id on mount
- Renders `ResumeStepForm` pre-filled with existing data
- On save redirect to `/dashboard`

### Analyze

- Fetch resume by id on mount to show resume title
- Top section: `AnalyzeForm` with textarea for job description and Analyze button
- Show loading spinner while waiting for Groq response
- Bottom section: `AnalyzeResult` renders after response:
  - Match score as a progress bar
    - Red: below 50
    - Yellow: 50-75
    - Green: above 75
  - Missing keywords as tags
  - Strengths as tags
  - Suggestions as a numbered list
  - Export PDF button

---

## Theme — Light/Dark Toggle

- Use Tailwind `darkMode: "class"` strategy
- Store preference in localStorage under key `"theme"`
- On app load, read from localStorage and apply `class="dark"` to `<html>` if needed
- `ThemeToggle.jsx` in Navbar toggles the class and updates localStorage

**tailwind.config.js:**

```js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

---

## PDF Export — `exportPdf.js`

Use `jsPDF` to generate a clean text-based PDF from resume content. Include all sections in order: summary, experience, education, skills, projects. Keep it simple — no complex styling, just clean readable text with section headings.

---

## Important Instructions for Claude Code

- Use Vite + React, not Create React App
- Use Tailwind CSS for all styling, no other CSS frameworks
- Use React Router v6 for all routing
- Use Axios for all API calls, never use fetch directly
- No TypeScript — plain JavaScript only
- Keep components small and single-purpose
- All API calls go through `src/services/api.js` only — never call axios directly in a component or page
- Use `useNavigate` for redirects after login, logout, and save actions
- Show loading states on all async actions (buttons should show loading text or spinner)
- Show error messages from the API response, not generic messages
- Token stored in localStorage under key `"token"`
- Never hardcode the API URL — always use `import.meta.env.VITE_API_URL`
- `ProtectedRoute.jsx` must wrap all routes that require auth
