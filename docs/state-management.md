# State Management and Storage

Where every piece of state lives and how it persists. The base spec rule: _"Context — global auth state only"_ ([resume-optimizer-frontend-spec.md](resume-optimizer-frontend-spec.md)).
Related: [component-tree.md](component-tree.md) · [functional-requirements.md](functional-requirements.md) · [error-handling.md](error-handling.md)

---

## 1. Overview

| State                                     | Owner                                                  | Persistence                                                        |
| ----------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| Auth (token, user)                        | `AuthContext` (the only context)                       | localStorage `token`, `user`                                       |
| Theme                                     | `ThemeToggle` + inline script in `index.html`          | localStorage `theme`                                               |
| Resume list, delete modal, active tab     | `Dashboard` page                                       | —                                                                  |
| Drafts, banner dismissal                  | `useDrafts` hook                                       | localStorage `drafts:{userId}`, `draftsBannerDismissedAt:{userId}` |
| Builder form data                         | `useResumeForm` (`useReducer`) inside `ResumeStepForm` | — (drafts only on session expiry)                                  |
| Current builder step                      | router **history state** (`location.state.step`)       | browser history                                                    |
| Analyze: resume, analyses, request status | `Analyze` page                                         | —                                                                  |
| Toasts                                    | `react-hot-toast` global store                         | —                                                                  |

No Redux, Zustand or React Query.

---

## 2. localStorage keys (`STORAGE_KEYS` in constants)

| Key                                | Value                                  | Written by                | Cleared by                               |
| ---------------------------------- | -------------------------------------- | ------------------------- | ---------------------------------------- |
| `token`                            | JWT string                             | `login()`                 | `logout()`                               |
| `user`                             | JSON `{ id, name, email, created_at }` | `login()`                 | `logout()`                               |
| `theme`                            | `"light"` \| `"dark"`                  | `ThemeToggle`             | never (absent means follow the OS)       |
| `drafts:{userId}`                  | JSON `Draft[]`                         | `useDrafts.saveDraft`     | per the draft rules                      |
| `draftsBannerDismissedAt:{userId}` | ISO string                             | `useDrafts.dismissBanner` | never (compared to the newest `savedAt`) |

All reads are wrapped in `try/catch`. Invalid JSON is treated as absent and the key is removed.

---

## 3. AuthContext (`context/AuthContext.jsx`)

```js
{
  user,             // { id, name, email, created_at } | null
  token,            // string | null
  isAuthenticated,  // boolean
  displayName,      // user.name || email prefix
  login(token, user),
  logout(),
}
```

- **Init:** synchronously read `token` and `user` from localStorage in the `useState` initializer. There's no flash of logged-out UI.
- **Subscriptions:** subscribes to `authEvents.onSessionExpired` (see [error-handling.md §4](error-handling.md)).
- **Tree position:** `AuthProvider` sits **above** `RouterProvider`, so it cannot navigate itself. Redirects happen through `ProtectedRoute`/`GuestRoute` reacting to `isAuthenticated`, and through pages calling `useNavigate`.
- `useAuth()` in `hooks/useAuth.js` reads the context and throws if it's used outside the provider.

---

## 4. Theme

- `index.html` `<head>` inline script:
  ```js
  const t = localStorage.getItem("theme")
  const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
  document.documentElement.classList.toggle("dark", dark)
  ```
  (wrapped in try/catch).
- `ThemeToggle`:
  - reads the current state from `document.documentElement.classList`;
  - on click, toggles the class and writes `theme`;
  - while no `theme` key exists, listens to `matchMedia` changes and follows them.

---

## 5. Builder form (`hooks/useResumeForm.js`)

### 5.1 State shape

```js
{
  data: {
    title: "",
    content: {
      contact: { name, email, phone, location },
      summary: "",
      experience: [{ id, company, role, duration, bullets: [{ id, text }] }],
      education:  [{ id, institution, degree, year }],
      skills:     ["React"],
      projects:   [{ id, name, description, tech: ["Node"], link }],
    },
  },
  initialSnapshot: "<JSON of data used for dirty check>",
  errors: { "contact.email": "Enter a valid email address", ... },
}
```

- Client-only `id`s (from `crypto.randomUUID()`) give array items stable React keys. Bullets are stored as `{ id, text }` internally.
- `toPayload(data)` strips the ids, turns bullets back into strings, trims everything and removes empty bullets ([api-contracts.md §3.2](api-contracts.md)).
- `fromResume(resume)` normalizes server data (fills missing keys) and adds ids.

### 5.2 Actions

`SET_FIELD(path, value)` · `ADD_ITEM(section)` · `REMOVE_ITEM(section, id)` · `ADD_BULLET(expId)` · `UPDATE_BULLET(expId, bulletId, text)` · `REMOVE_BULLET(expId, bulletId)` · `ADD_TAG(path, tag)` · `REMOVE_TAG(path, index)` · `SET_ERRORS(errors)` · `CLEAR_ERROR(path)` · `RESET(data)` · `MARK_SAVED()`

### 5.3 Hook API

```js
const {
  data,
  errors,
  isDirty,
  setField,
  addItem,
  removeItem,
  addBullet,
  updateBullet,
  removeBullet,
  addTag,
  removeTag,
  validateStep, // (step) => boolean, sets errors
  validateAll, // () => firstInvalidStep | null
  reset,
  markSaved,
  toPayload,
} = useResumeForm(initialData, { isDirtyFromStart })
```

- `isDirty = isDirtyFromStart || JSON.stringify(stripIds(data)) !== initialSnapshot`.
- `isDirtyFromStart` is true for restored drafts.

### 5.4 Step state

- Read from `location.state?.step ?? 1`.
- Writes:
  - Next: `navigate(pathname, { state: { ...location.state, step: n + 1, viaNext: true } })`.
  - Back: `navigate(-1)` when `location.state.viaNext`, otherwise `replace` with step − 1.
- On mount (no draft): `replace` with `{ step: 1 }`, so a refresh or a fresh entry always starts at 1.
- Guard effect: when `step` changes, `validateAll` up to `step - 1`. If an earlier step fails, `replace` to it.

---

## 6. Drafts (`hooks/useDrafts.js`)

### 6.1 Draft object

```js
{
  id: "uuid",                 // draft id
  resumeId: 12 | null,        // null for create-mode
  mode: "create" | "edit",
  sessionKey: "uuid",         // identifies one create-mode builder session
  title: "Frontend Resume",   // copy of data.title for the card
  data: { title, content },   // payload-shaped form data
  step: 4,
  savedAt: "ISO",
}
```

### 6.2 Hook API

```js
const {
  drafts,              // sorted by savedAt desc, purged of > 30-day-old entries
  saveDraft(draft),    // upsert; replace by resumeId (edit) or sessionKey (create); evict oldest if > 10
  deleteDraft(id),
  deleteDraftForResume(resumeId),
  getDraft(id),
  showBanner,          // drafts.length > 0 && newest savedAt > dismissedAt
  dismissBanner(),
} = useDrafts(userId)
```

- `saveDraft` writes to localStorage **synchronously**, so it is safe inside the session-expiry callback.
- `MAX_DRAFTS = 10` and `DRAFT_TTL_DAYS = 30` live in constants.
- **Builder session-expiry hookup:** `ResumeStepForm` subscribes to `authEvents.onSessionExpired` while mounted. It keeps the latest `data`, `step`, `isDirty`, `mode`, `resumeId` and `sessionKey` in a ref, and calls `saveDraft` if dirty.
- A restored create-mode draft reuses its `sessionKey`. A fresh `/resume/new` session generates a new one.

---

## 7. `utils/authEvents.js`

A minimal module-level pub/sub with no React dependency, usable from `api.js`:

```js
const listeners = new Set()
export function onSessionExpired(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
export function emitSessionExpired() {
  listeners.forEach((fn) => fn())
}
```

---

## 8. Unsaved-changes blocking (`hooks/useUnsavedChanges.js`)

```js
const { blocker, confirmLeave, cancelLeave } = useUnsavedChanges(isDirty)
```

- Uses `useBlocker(({ currentLocation, nextLocation }) => enabled && currentLocation.pathname !== nextLocation.pathname)`, where `enabled = isDirty && isAuthenticated && !bypassRef.current`.
- Adds a `beforeunload` listener while dirty.
- Exposes `bypass()`, used before navigating after a successful save.
- `ResumeStepForm` renders the Discard `ConfirmModal` when `blocker.state === "blocked"`. Confirming calls `blocker.proceed()`; canceling calls `blocker.reset()`.
- **Logout from the Navbar:** the Navbar calls `navigate("/logout")`. `/logout` is a tiny protected route element (`pages/Logout.jsx`, not lazy-loaded). On mount it calls `logout()`, shows the "You've been logged out." toast, and renders `<Navigate to="/login" replace />`. The blocker sees a normal pathname change, so the discard modal covers Logout with no special case. Logout runs only when the navigation actually happens.
- **New Resume on `/resume/new`:** same pathname, so the blocker doesn't fire. The Navbar doesn't navigate. It dispatches the window event `NEW_RESUME_EVENT` (from constants), so the hidden step history isn't overwritten. `ResumeStepForm` (create mode) listens for it: if dirty, it shows the Discard modal (on confirm: reset to an empty resume at Step 1 with a new session key, deleting the active draft if there is one); if clean, nothing happens.
