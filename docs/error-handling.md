# Error Handling Strategy

How every failure is detected, turned into a message, and shown. Base spec rule: _"Show error messages from the API response, not generic messages"_ ([resume-optimizer-frontend-spec.md](resume-optimizer-frontend-spec.md)).
Related: [api-contracts.md](api-contracts.md) · [functional-requirements.md](functional-requirements.md) · [state-management.md](state-management.md)

---

## 1. Error categories

| #   | Category                         | How it's detected (axios error)                                                                                          | Message shown                                               | Where                                  |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------- |
| 1   | **Session expired**              | `response.status === 401`, the request had a token, URL not `/auth/*` → interceptor sets `error.isSessionExpired = true` | "Session expired. Please log in again."                     | toast (once), then logout and redirect |
| 2   | **Timeout**                      | `error.code === "ECONNABORTED"` or `"ETIMEDOUT"`                                                                         | "The request timed out. Please try again."                  | toast                                  |
| 3   | **Network / server unreachable** | `!error.response` (and not a timeout or cancel)                                                                          | "Unable to reach the server. Please check your connection." | toast                                  |
| 4   | **API error with message**       | `error.response.data.error` is a non-empty string                                                                        | that exact string                                           | toast (or a redirect + toast, see §3)  |
| 5   | **API error without message**    | `error.response` exists but has no `data.error`                                                                          | "Something went wrong. Please try again."                   | toast                                  |
| 6   | **Cancelled request**            | `axios.isCancel(error)` / `error.code === "ERR_CANCELED"`                                                                | nothing                                                     | —                                      |
| 7   | **Client validation**            | local rules in `utils/validation.js`                                                                                     | field-specific text                                         | inline under the field                 |
| 8   | **Render crash**                 | React Error Boundary                                                                                                     | "Something went wrong." + Reload                            | full-screen fallback                   |

All the fixed strings live in `src/constants/index.js` (`TOAST_MESSAGES`).

---

## 2. `utils/apiError.js`

```js
export function getErrorMessage(error) {
  /* categories 2–5 → string */
}
export function isNotFound(error) {
  /* status 404 or 403 */
}
export function shouldShowError(error) {
  /* false for categories 1 and 6 */
}
```

**Page pattern** (every API call in pages):

```js
try {
  const { data } = await getResumes()
  // …
} catch (error) {
  if (shouldShowError(error)) toast.error(getErrorMessage(error))
}
```

- Components never catch API errors because they never call the API.
- A session-expired error is ignored by the page, because the global handler already responded.

---

## 3. Per-screen behavior

| Screen / action                                    | On failure                                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Login / Register submit                            | Toast with the API message (including 401 wrong password). Form stays filled; button re-enabled                      |
| Dashboard load                                     | Toast + inline error panel with **Retry** in place of the grid                                                       |
| Delete resume                                      | Close the modal, show the toast. The card stays                                                                      |
| Builder: edit load                                 | 404/403: redirect `/dashboard` + toast "Resume not found." Other errors: redirect `/dashboard` + the API error toast |
| Builder: restore of edit draft, resume missing     | Delete the draft, redirect `/dashboard`, toast "Resume no longer exists."                                            |
| Builder save                                       | Toast with the API message. Stay on the step with the data intact                                                    |
| Builder save, session expired                      | Draft saved → logout → `/login` + the session-expired toast                                                          |
| Builder save with invalid earlier step (edit mode) | Toast "Please complete all required fields" + jump to the first invalid step                                         |
| Analyze page: resume load                          | 404/403: redirect `/dashboard` + toast "Resume not found."                                                           |
| Analyze page: analyses load                        | Inline error panel with **Retry** in the result/history area. The form still works                                   |
| Analyze submit                                     | Toast (including the timeout message at 30 s). Text kept; form re-enabled                                            |
| Analyze slow (> 10 s, still pending)               | Inline muted note "This is taking longer than usual, please wait..." (not an error)                                  |
| PDF export                                         | `jspdf` import or generation fails: toast "Couldn't generate the PDF. Please try again."                             |

---

## 4. Session-expiry sequence

```
api.js response interceptor (401, token present, not /auth/*)
  └─ error.isSessionExpired = true
  └─ emitSessionExpired()          ← utils/authEvents.js (tiny pub/sub)
        ├─ builder listener (if mounted & dirty): saveDraft(...) synchronously
        └─ AuthContext listener:
              if (!handling) { handling = true
                logout()            → clears token/user → ProtectedRoute redirects to /login
                toast.error("Session expired. Please log in again.", { id: "session-expired" })
              }
```

- The toast `id` stops duplicates when several requests fail at once.
- The unsaved-changes blocker is disabled when `isAuthenticated` is false, so the redirect is never blocked.
- `handling` resets the next time `login()` runs.

---

## 5. Error Boundary

- `components/common/ErrorBoundary.jsx` (class component). It wraps the whole app in `main.jsx`, outside the router.
- Fallback: centered on `bg-bg`, `AlertCircle` icon, the text "Something went wrong." and a primary **Reload** button that calls `window.location.reload()`.
- `componentDidCatch` logs with `console.error`. No remote reporting in v1.

---

## 6. Validation errors

- Rules and messages live in `utils/validation.js` and `constants`. Each step validator returns `{ [fieldPath]: message }` (e.g. `"experience.0.company"`).
- They show inline only, never as toasts. The exception is the edit-mode "Please complete all required fields" toast, which explains the step jump.

| Rule               | Message                                               |
| ------------------ | ----------------------------------------------------- |
| required (generic) | "{Field} is required"                                 |
| email format       | "Enter a valid email address"                         |
| name min           | "Name must be at least 2 characters"                  |
| password min       | "Password must be at least 6 characters"              |
| confirm mismatch   | "Passwords do not match"                              |
| URL                | "Enter a valid URL starting with http:// or https://" |
| tech empty         | "Add at least one technology"                         |
| duplicate tag      | "“{tag}” is already added"                            |
