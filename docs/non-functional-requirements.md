# Non-Functional Requirements

Quality attributes the app must meet. Base spec: [resume-optimizer-frontend-spec.md](resume-optimizer-frontend-spec.md) → "Important Instructions for Claude Code".
Related: [functional-requirements.md](functional-requirements.md) · [error-handling.md](error-handling.md) · [design.md](design.md)

---

## 1. Tech stack and versions

| Item            | Choice                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Build           | Vite **5.x** (compatible with Node 18) + `@vitejs/plugin-react`                                        |
| UI              | React **18.3.x**, plain JavaScript (`.jsx` / `.js`). No TypeScript                                     |
| Routing         | React Router **v6** (`react-router-dom@6`, latest 6.x), using `createBrowserRouter` + `RouterProvider` |
| Styling         | Tailwind CSS **3.4.x** + PostCSS + Autoprefixer. `darkMode: "class"`. No other CSS framework           |
| HTTP            | Axios (never `fetch`)                                                                                  |
| PDF             | jsPDF, dynamically imported                                                                            |
| Icons           | `lucide-react`                                                                                         |
| Toasts          | `react-hot-toast`                                                                                      |
| Dates           | `date-fns`                                                                                             |
| Font            | Inter via Google Fonts `<link>` in `index.html`                                                        |
| Package manager | **npm** (commit `package-lock.json`)                                                                   |
| Node            | **≥ 18**, declared in `package.json` `"engines"` and `.nvmrc` (`18`)                                   |

No other runtime dependencies without approval.

---

## 2. Performance

- No formal Lighthouse or bundle target. Avoid obvious bloat: no heavy UI kits, no moment.js, no lodash (cherry-pick if ever needed).
- **Route-level code splitting:** every page is loaded with `React.lazy`, with a `Suspense` fallback (centered Spinner).
- **jsPDF** is imported only when Export PDF is clicked (`await import("jspdf")`).
- Lucide icons are imported by name, so they tree-shake.
- `date-fns` uses named function imports only.
- Requests:
  - default timeout 10 s;
  - `POST /analyze` 30 s;
  - the Analyze page fetches the resume and the analyses in parallel;
  - no duplicate fetches on mount (guarded against React 18 StrictMode double effects with an abort/ignore flag).
- After a delete, the dashboard updates locally and does not refetch.

---

## 3. Accessibility: WCAG 2.1 AA (whole app)

### 3.1 Perceivable

- Color contrast meets AA (text 4.5:1, large text and UI 3:1). The verified pairs are in [design.md §1.2](design.md).
- Color is never the only signal: the score shows as a number, error fields have text messages, and the active step has `aria-current`.
- Every icon-only button has an `aria-label`. Decorative icons have `aria-hidden="true"`.
- Content reflows at 375px wide and at 200% zoom with no horizontal scrolling.

### 3.2 Operable

- **Every action works by keyboard alone**, in a logical tab order.
- A visible focus indicator on every interactive element (`ring-accent`). It is never removed.
- A **skip link** ("Skip to main content") is the first focusable element in both layouts.
- **Modals** (Delete, Discard):
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title;
  - focus trap; Esc closes (= cancel);
  - initial focus goes to the **cancel** button;
  - focus returns to the trigger on close;
  - the background has `inert`.
- Tag inputs: Enter adds a tag, and each tag's remove button is reachable by Tab.
- History rows and the history toggle are `<button>`s with `aria-expanded` and `aria-controls`.
- Sidebar links mark the current page with `aria-current="page"`.
- Clickable cards use a single real `<a>` (stretched link). Nested buttons stay independently focusable.
- Minimum target size: 40×40px for icon buttons.

### 3.3 Understandable

- Every input has a visible `<label>`. Required fields use `required`/`aria-required`.
- Field errors use `aria-invalid="true"` and are linked with `aria-describedby`. On a failed Next or submit, focus moves to the first invalid field.
- `<html lang="en">`, and each page sets `document.title`.
- After a builder step change, focus moves to the step heading (`tabIndex={-1}`).

### 3.4 Robust

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<ol>` for the StepIndicator and suggestions, `<button>` and `<a>` used correctly.
- Toasts are announced through an `aria-live` region. react-hot-toast provides `role="status"` / `aria-live="polite"`, and errors use `role="alert"`.
- The loading spinner has `role="status"` and visually hidden text "Loading…". Skeleton containers have `aria-busy="true"`.
- The ScoreBar has `role="progressbar"`.

### 3.5 Motion

- `prefers-reduced-motion: reduce` disables the step fade, modal animation, theme transition, card hover transition and the skeleton pulse. Use Tailwind `motion-safe:` variants plus a global CSS rule.

---

## 4. Browser and device support

| Target           | Support                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| Desktop          | Last 2 versions of Chrome, Firefox, Safari and Edge                        |
| Mobile           | iOS Safari and Chrome Android, last 2 versions                             |
| Minimum viewport | **375px** wide                                                             |
| Breakpoints      | Tailwind defaults: `md` 768px (2-column grid), `lg` 1024px (3-column grid) |

Responsive rules:

- Navbar below `md`: hide the email, and make New Resume and Logout icon-only. No hamburger menu.
- Builder action bar: wraps onto two rows on narrow screens, with Cancel on its own row first.
- StepIndicator below `md`: circles only, plus the text "Step N of 6 · {name}".
- Touch: no hover-only actions. Every action is visible without hover.

---

## 5. Error handling and resilience

Full strategy: [error-handling.md](error-handling.md). Summary:

- Every API error message comes from `response.data.error`. Generic text is used only when no message exists.
- Network failure, timeout and session expiry have fixed messages.
- A root-level React **Error Boundary** shows "Something went wrong." plus **Reload**.
- **Error tracking** (Sentry etc.) is out of scope for v1.
- `console.log` is banned by ESLint (`no-console: ["error", { allow: ["warn", "error"] }]`).

---

## 6. Security

- JWT and user live in `localStorage` (spec requirement). The XSS trade-off is accepted for v1, with no extra mitigations.
- Never use `dangerouslySetInnerHTML`. All user and AI text renders as React text nodes.
- URLs:
  - Project links must parse with `new URL()` and use `http:` or `https:`. Anything else fails validation.
  - All external links open with `target="_blank" rel="noopener noreferrer"`.
- The API URL comes only from `import.meta.env.VITE_API_URL`. `.env` is git-ignored, and `.env.example` is committed.
- Hard input length limits (`maxLength`; typing stops at the limit):

  | Field                                                                                      | Max   |
  | ------------------------------------------------------------------------------------------ | ----- |
  | user name, contact name, location, title, company, role, institution, degree, project name | 100   |
  | email                                                                                      | 254   |
  | phone                                                                                      | 30    |
  | duration, year                                                                             | 50    |
  | summary, project description                                                               | 500   |
  | bullet                                                                                     | 200   |
  | skill / tech tag                                                                           | 50    |
  | link                                                                                       | 2,048 |
  | job description                                                                            | 5,000 |

- Logout and session expiry clear `token` and `user`. Drafts persist per user id, and only that user's drafts are shown.

---

## 7. Maintainability and code quality

- **Architecture** (from the spec): Pages → Components → Services (`api.js`). Pages own fetching and page state. Components get props and never call the API. Context is for **auth only**.
- Keep components small and single-purpose. See [component-tree.md](component-tree.md).
- **ESLint:** the default Vite React flat config (`eslint.config.js`: `@eslint/js` recommended, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`), plus:
  - `no-console: ["error", { allow: ["warn", "error"] }]`
  - `eslint-config-prettier`, last, to turn off style rules.
- **Prettier** (`.prettierrc`):
  ```json
  { "semi": false, "singleQuote": false, "printWidth": 100, "trailingComma": "es5" }
  ```
  Also `.prettierignore` (`dist`, `node_modules`, `package-lock.json`).
- **Scripts:** `dev`, `build`, `preview`, `lint`, `format` (`prettier --write .`), `format:check`.
- **Conventions:**
  - components are PascalCase `.jsx` with **default exports**;
  - hooks and utils are camelCase `.js` with **named exports**;
  - no barrel `index.js` re-export files (`src/constants/index.js` is a real module, not a barrel);
  - no PropTypes or JSDoc in v1.
- **Magic values** (limits, messages, storage keys, step definitions, timeouts) live in `src/constants/index.js`.
- **README.md:**
  - project description;
  - stack;
  - prerequisites (Node ≥ 18, the running backend);
  - setup (`npm install`, copy `.env.example` to `.env`);
  - scripts;
  - folder structure;
  - links to `docs/`.
- **Out of scope for v1:** automated tests, deployment config, CI.

---

## 8. Internationalization

English only. No i18n framework. Strings are centralized in constants, so i18n could be added later.
