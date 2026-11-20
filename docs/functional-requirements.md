# Functional Requirements

Everything the user can do and how the system responds. Base spec: [resume-optimizer-frontend-spec.md](resume-optimizer-frontend-spec.md).
Related docs: [user-flow.md](user-flow.md) · [api-contracts.md](api-contracts.md) · [state-management.md](state-management.md) · [error-handling.md](error-handling.md) · [greeting-messages.md](greeting-messages.md) · [design.md](design.md) · [component-tree.md](component-tree.md)

Requirement IDs (`FR-AREA-NN`) are referenced from the other docs.

---

## 0. Changes from the original spec

| #   | Change                                                                                     | Reason                                                                                        |
| --- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 1   | Builder has **6 steps**: Contact Details is the new Step 1, and Basic Info moves to Step 2 | Resumes need contact details. Without them the PDF had no name                                |
| 2   | Register takes **name** (required)                                                         | Personalised greetings. Needs a backend migration ([api-contracts.md §2.1](api-contracts.md)) |
| 3   | `content.contact` added                                                                    | JSONB, so no backend change                                                                   |
| 4   | Analyze page shows the **5 previous analyses** (uses `getAnalyses`)                        | The spec defined the API but no UI for it                                                     |
| 5   | PDF contains **resume + analysis**                                                         |                                                                                               |
| 6   | **Drafts** (dashboard tab + banner), created on session expiry                             | Prevents losing work                                                                          |
| 7   | Every builder step has **Cancel**. In edit mode, **Save** is on every step                 | The spec's "Step 1 has only Next" no longer holds                                             |
| 8   | 404 page, root Error Boundary, toasts, welcome greetings                                   |                                                                                               |
| 9   | Router uses `createBrowserRouter` (still React Router v6)                                  | Required for `useBlocker` (unsaved-changes modal)                                             |
| 10  | Added deps: `lucide-react`, `react-hot-toast`, `date-fns`                                  |                                                                                               |

---

## 1. Authentication

### FR-AUTH-01 Register

- Route `/register`. Fields: **Name**, **Email**, **Password**, **Confirm password**.
- Client validation runs on submit. After the first submit attempt, each field re-validates as it changes.

  | Field            | Rules                                             | Error message                                                     |
  | ---------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
  | Name             | required; 2–100 chars after trim; `maxLength` 100 | "Name is required" / "Name must be at least 2 characters"         |
  | Email            | required; email format; `maxLength` 254           | "Email is required" / "Enter a valid email address"               |
  | Password         | required; ≥ 6 chars                               | "Password is required" / "Password must be at least 6 characters" |
  | Confirm password | must equal Password                               | "Passwords do not match"                                          |

- Submit button "Create account". While loading: "Creating account…" and disabled.
- Success: `register(name, email, password)` returns `{ token, user }`. Then `login(token, user)`, navigate to `/dashboard`, and show the **register welcome toast** ([FR-GREET-01](#fr-greet-01-welcome-toast)).
- API error: toast with `error` from the response ([error-handling.md](error-handling.md)).
- Link below the form: "Already have an account? **Log in**" goes to `/login`.

### FR-AUTH-02 Login

- Route `/login`. Fields: **Email**, **Password** (same rules as register).
- Submit button "Log in". While loading: "Logging in…".
- Success: `login(token, user)`, navigate to `/dashboard` (always, with no return-to-previous-page), and show the **login welcome toast**.
- A 401 or other error shows the API message as a toast. It never triggers session-expired handling.
- Link below the form: "Don't have an account? **Register**" goes to `/register`.

### FR-AUTH-03 Guest-only routes

A logged-in user who visits `/login` or `/register` is redirected to `/dashboard` (replace).

### FR-AUTH-04 Session persistence

- `login(token, user)` writes `localStorage.token` and `localStorage.user` (JSON) and updates context.
- On app load, `AuthContext` restores `token` and `user` from localStorage. The JWT is **not** decoded.
- `isAuthenticated = Boolean(token && user)`. If either value is missing or `user` fails to parse, both are cleared.

### FR-AUTH-05 Logout

- The Navbar **Logout** button logs out immediately (no confirmation). It navigates to the internal route `/logout`, which clears `token` and `user` (drafts and theme stay), shows the toast "You've been logged out." and replaces to `/login`.
- **Exception:** inside the builder with unsaved changes, the discard modal appears first ([FR-BLD-12](#fr-bld-12-unsaved-changes-protection)). Because Logout is a route change, the blocker handles it like any other navigation.

### FR-AUTH-06 Session expiry

- Trigger: any API response with **401** on a request that carried a token, to a non-`/auth/*` endpoint.
- The system:
  1. If the builder is open with unsaved changes, saves a **draft** ([FR-DRAFT-01](#fr-draft-01-automatic-draft-on-session-expiry)).
  2. Logs out (clears token and user).
  3. Redirects to `/login`, **skipping** the discard modal.
  4. Shows the toast "Session expired. Please log in again." once, even if several requests fail together.
- The page that made the failing request shows no other error toast.

### FR-AUTH-07 Protected routes

`/dashboard`, `/resume/new`, `/resume/:id/edit`, `/resume/:id/analyze` and the internal `/logout` route are wrapped in `ProtectedRoute`. With no session they redirect to `/login` (replace).

### FR-AUTH-08 Root route

`/` is the public landing page for everyone (see [§10](#10-public-site)). Logged-in visitors see "Go to dashboard" in its navbar instead of Login / Get Started.

---

## 2. Welcome greetings

### FR-GREET-01 Welcome toast

- Shown once, right after a successful **register** (register message set) or **login** (login message set). It is a success toast, shown for 4 s.
- Uses the **display name**: `user.name`, or the email prefix before `@` if name is null or empty.
- Message selection, based on the user's local date and time, in priority order:
  1. **Holiday:** Jan 1 (New Year), Dec 25 (Christmas), Easter Sunday (calculated with the anonymous Gregorian algorithm). Single day only.
  2. **Weekend:** Saturday or Sunday.
  3. **Time sub-band:** one of the 13 sub-bands below.
- Only one message is shown, never a combination. When a bucket has several variants, one is picked at random.

  | Band      | Sub-band       | Hours (start inclusive, end exclusive) |
  | --------- | -------------- | -------------------------------------- |
  | Morning   | Early morning  | 05:00–07:00                            |
  |           | Morning        | 07:00–09:00                            |
  |           | Mid-morning    | 09:00–11:00                            |
  |           | Late morning   | 11:00–12:00                            |
  | Afternoon | Midday         | 12:00–13:00                            |
  |           | Afternoon      | 13:00–15:00                            |
  |           | Late afternoon | 15:00–17:00                            |
  | Evening   | Early evening  | 17:00–18:00                            |
  |           | Evening        | 18:00–20:00                            |
  |           | Late evening   | 20:00–21:00                            |
  | Night     | Night          | 21:00–23:00                            |
  |           | Midnight       | 23:00–01:00                            |
  |           | Small hours    | 01:00–05:00                            |

- The full message set is in [greeting-messages.md](greeting-messages.md). Logic lives in `hooks/useGreeting.js`.

---

## 3. Navbar and layout

### FR-NAV-01 App layout and top navbar

Authenticated pages use `AppLayout`: a CSS grid with areas `"sidebar navbar" / "sidebar content"`, columns `auto 1fr`, rows `auto 1fr`.

Top navbar: `[☰ (mobile)] [ResumeAI] ····· [ThemeToggle] [avatar ▾]`

- **ResumeAI** links to `/dashboard`.
- Below `md`: the hamburger opens the sidebar drawer.

### FR-NAV-06 Profile dropdown (`common/ProfileDropdown.jsx`)

- **Avatar:** a 36px circle showing the first letter of `user.name`, or of the email when there's no name.
  - Its colors come from hashing the email into one of 8 WCAG AA pairs (`AVATAR_COLORS`), so the same email always gets the same color.
  - The button has `aria-haspopup="menu"`, `aria-expanded` and the label "Account menu for {name}".
- **Menu** (below the avatar, right-aligned):
  - a header with the name (bold) and email (muted), not interactive;
  - a divider;
  - **Settings** (`Settings` icon): a "Coming soon" toast;
  - a divider;
  - **Logout** (`LogOut` icon, warning color): `navigate("/logout")`, so the unsaved-changes blocker still applies.
- **Keyboard:**
  - on open, focus goes to the first item;
  - Tab / Shift+Tab / ArrowUp / ArrowDown / Home / End move between the items and stay inside the menu;
  - Esc closes it and returns focus to the avatar.
- **Clicking outside** closes it. Focus returns to the avatar unless the click landed on something focusable.

### FR-NAV-05 Sidebar

| Item          | Icon            | Goes to                                                                                       |
| ------------- | --------------- | --------------------------------------------------------------------------------------------- |
| Overview      | LayoutDashboard | `/dashboard`                                                                                  |
| My Resumes    | FileText        | `/dashboard/resumes`                                                                          |
| Create Resume | FilePlus        | `/resume/new`. If already there, see [FR-BLD-13](#fr-bld-13-new-resume-while-on-the-builder). |
| Analyze       | BarChart2       | `/analyze` (resume picker). Also shown active on `/resume/:id/analyze`.                       |
| Drafts        | FolderOpen      | `/dashboard/drafts`                                                                           |

- **Active item:** `bg-primary/10 text-primary` (label in the normal text color in dark mode). Each item matches its route exactly, so `/dashboard` highlights only Overview. The builder's edit page highlights nothing.
- **md and up:**
  - 240px expanded (icon + label), 64px collapsed (icon only, label kept for screen readers and as a tooltip);
  - a toggle at the bottom (ChevronLeft / ChevronRight);
  - width animates (200 ms);
  - the collapsed state is saved in localStorage `sidebar_collapsed` (`"true"` / `"false"`).
- **Below md:** hidden. The hamburger opens it as an overlay drawer (always expanded) with a backdrop.
  - Closes on backdrop click, Esc, the close button, or choosing an item.
  - Focus moves to the close button on open and back to the hamburger on close.
  - While it's open, the navbar and content are inert and the page doesn't scroll.

### FR-NAV-02 Public Navbar

`[ResumeAI] ····· [ThemeToggle]`. Used on `/login`, `/register`, `/privacy-policy`, `/terms-and-conditions` and the 404 page. ResumeAI links to `/`.

### FR-NAV-03 Theme toggle

- Toggles `class="dark"` on `<html>` and stores `"light"` or `"dark"` in `localStorage.theme`.
- With no stored value, the theme follows the OS and updates live when the OS setting changes.
- `aria-label` is "Switch to dark mode" or "Switch to light mode".

### FR-NAV-04 Page titles

Each route sets `document.title` to `{Page} · ResumeAI`:

| Route               | Title                     |
| ------------------- | ------------------------- |
| /login              | Log in · ResumeAI         |
| /register           | Register · ResumeAI       |
| /dashboard          | Dashboard · ResumeAI      |
| /resume/new         | New Resume · ResumeAI     |
| /resume/:id/edit    | Edit Resume · ResumeAI    |
| /resume/:id/analyze | Analyze · ResumeAI        |
| 404                 | Page Not Found · ResumeAI |

---

## 4. Dashboard pages

### FR-DASH-01 Pages

The dashboard is three flat routes in `AppLayout`, reached from the sidebar. There are no tabs and no `?tab=` query.

| Route                | Page                       | Heading / browser title                |
| -------------------- | -------------------------- | -------------------------------------- |
| `/dashboard`         | `Dashboard.jsx` (Overview) | "Overview" / "Overview · ResumeAI"     |
| `/dashboard/resumes` | `MyResumes.jsx`            | "My Resumes" / "My Resumes · ResumeAI" |
| `/dashboard/drafts`  | `Drafts.jsx`               | "Drafts" / "Drafts · ResumeAI"         |

### FR-DASH-09 Overview (`/dashboard`)

Data comes from `useResumesWithAnalyses`:

- `getResumes()` first, then `getAnalyses(id)` for each resume, at most 4 requests at a time, aggregated on the client.
- The same hook powers the Analyze picker. My Resumes uses it with `{ withAnalyses: false }`, so it makes only the `getResumes()` request.

**Stats row** (3 `bg-surface` cards):

| Card                | Value                                                                          |
| ------------------- | ------------------------------------------------------------------------------ |
| Total Resumes       | number of resumes                                                              |
| Total Analyses Run  | number of analyses across all resumes                                          |
| Average Match Score | mean of all `match_score` values, rounded, as `NN%`; "N/A" when there are none |

- Each value shows a skeleton until its data arrives. Total Resumes appears as soon as the resumes load.
- If some resumes' analyses fail to load, the stats use the rest and show "Some analyses couldn't be loaded, so these numbers may be incomplete."
- If `getResumes` fails, the page shows the standard ErrorPanel with Retry.

**Recent activity:** the 5 newest resumes as compact rows (title, "Created …", Analyze → `/resume/:id/analyze`), with 3 skeleton rows while loading.

**Quick actions:** two link cards.

- **Create Resume** (`FilePlus`) → `/resume/new`
- **Import Resume** (`Upload`) → `/resume/new` (the import button is on the Contact step)

Overview reloads its data each time it's opened, so deletes made on My Resumes show up there.

### FR-DASH-02 Load resumes

- On mount, call `getResumes()`. While loading, show **6 skeleton cards** in the grid.
- Sort by `created_at` descending (newest first) on the client.
- Grid: 1 column on mobile, 2 at `md`, 3 at `lg`.

### FR-DASH-03 Resume card

- Shows the **title** and "Created {relative date}" ([FR-GEN-04](#fr-gen-04-date-formatting)).
- Actions: **Analyze** (primary, to `/resume/:id/analyze`), **Edit** (secondary, to `/resume/:id/edit`), **Delete** (destructive).
- Clicking anywhere else on the card goes to `/resume/:id/edit`. The card title is the keyboard-focusable link.

### FR-DASH-04 Delete resume

1. Delete opens the **ConfirmModal**. Title "Delete resume?", body "“{title}” will be permanently deleted. This can't be undone.", buttons **Cancel** (ghost) and **Delete** (destructive).
2. While `deleteResume(id)` runs, the Delete button shows "Deleting…", both buttons are disabled, and the modal stays open.
3. Success: close the modal, remove the card from local state (no refetch), delete any draft for that resume ([FR-DRAFT-06](#fr-draft-06-delete-resume-removes-its-draft)), and show the toast "Resume deleted."
4. Failure: close the modal and show the API error toast. The card stays.

### FR-DASH-05 Empty state

With zero resumes: the text "You have no resumes yet. Start by creating one!" and a **Create Resume** button (primary) that goes to `/resume/new`.

### FR-DASH-06 Load failure

If `getResumes()` fails: an inline error panel (`AlertCircle`, the API or network message) with a **Retry** button (secondary) that calls `getResumes()` again. The panel replaces the grid, and an error toast also fires.

### FR-DASH-07 Drafts banner

- Shown on Overview, under the heading, when the user has ≥ 1 draft **and** the banner hasn't been dismissed since the newest draft was saved.
- Text: "You have N unsaved draft(s)." (singular/plural: "1 unsaved draft" / "3 unsaved drafts"). Has a **View drafts** link-button to `/dashboard/drafts`, and a dismiss **X**.
- Dismissing hides the banner until a **new draft is saved** (any draft with `savedAt` later than the dismissal time).

### FR-DASH-08 Drafts page (`/dashboard/drafts`)

- Lists drafts as cards in the same grid, sorted by `savedAt` descending.
- Each card shows the **title** (`data.title` or "Untitled resume"), "Saved {relative date}", **Restore** (primary) and **Discard** (destructive).
- **Discard** deletes the draft immediately (no modal) and shows the toast "Draft discarded."
- **Restore**: see [FR-DRAFT-04](#fr-draft-04-restore-draft).
- Empty state: "No unsaved drafts."

---

## 5. Resume builder (`/resume/new`, `/resume/:id/edit`)

### FR-BLD-01 Page frame

- A "← Back to dashboard" link at the top. It goes to `/dashboard`, and is protected by [FR-BLD-12](#fr-bld-12-unsaved-changes-protection).
- Heading "Create resume" or "Edit resume".
- `StepIndicator` (6 steps, display only), then the current step form, then the action bar.

### FR-BLD-02 Steps

| #   | Step            | Fields                                                                                      |
| --- | --------------- | ------------------------------------------------------------------------------------------- |
| 1   | Contact Details | name*, email*, phone, location                                                              |
| 2   | Basic Info      | title*, summary (textarea + counter, 500)                                                   |
| 3   | Experience      | list of entries: company*, role*, duration* (placeholder "Jan 2023 - Present"), bullets     |
| 4   | Education       | list of entries: institution*, degree*, year                                                |
| 5   | Skills          | TagInput                                                                                    |
| 6   | Projects        | list of entries: name*, description* (textarea + counter, 500), tech* (TagInput, ≥ 1), link |

`*` = required. Limits and formats are in [api-contracts.md §3.2](api-contracts.md).

### FR-BLD-03 Action bar

Cancel sits at the bottom left. The other buttons sit at the bottom right, in this order:

| Step | Create mode                               | Edit mode                                       |
| ---- | ----------------------------------------- | ----------------------------------------------- |
| 1    | Cancel · Next                             | Cancel · Save Changes (secondary) · Next        |
| 2–5  | Cancel · Back · Next                      | Cancel · Back · Save Changes (secondary) · Next |
| 6    | Cancel · Back · **Save Resume** (primary) | Cancel · Back · **Save Resume** (primary)       |

In edit mode, **Save Changes** (Steps 1–5) is always the outlined secondary style. Only Step 6 has the filled primary **Save Resume**, which is the same label as in create mode. Both buttons run the same save logic ([FR-BLD-10](#fr-bld-10-edit-mode)).

Cancel goes to `/dashboard` and is protected by [FR-BLD-12](#fr-bld-12-unsaved-changes-protection).

### FR-BLD-04 Step validation

- **Next** validates the current step (rules in `utils/validation.js`). If it's invalid: show inline errors under each failing field, move focus to the first invalid field, and stay on the step.
- Errors clear field by field as the user corrects them.
- **Back** never validates.

### FR-BLD-05 Step navigation and history

- The step is **not in the URL**. It is stored in router history state: `navigate(pathname, { state: { step, viaNext: true } })`.
- **Next** (valid) pushes a history entry for step + 1.
- **In-app Back:** if the current entry was reached via Next, use `navigate(-1)`. Otherwise replace the entry with step − 1.
- **Browser Back** moves to the previous step's entry. On Step 1 (or the first builder entry), browser Back leaves the builder, protected by [FR-BLD-12](#fr-bld-12-unsaved-changes-protection).
- **Browser Forward** can only return to steps already reached. On every step change, if any earlier step is invalid, the app replaces to the first invalid step.
- **Initial step:** Step 1 on every fresh entry (create and edit), including after a refresh. The only exception is a restored draft, which opens at its saved step.
- Step changes fade in (200 ms, disabled under reduced motion), and focus moves to the step heading.

### FR-BLD-06 Array sections (Experience, Education, Projects)

- Create mode starts with **zero entries**, showing an empty hint ("No experience added yet.") and an **Add experience / Add education / Add project** button (secondary, `Plus`).
- Each entry is an `ArrayEntryCard` with a header ("Experience 1") and a **Remove** icon button (`Trash2`, aria-label "Remove experience 1"). Remove has no confirmation.
- Adding an entry appends an empty entry and focuses its first field.
- Zero entries is valid when saving. There is no maximum number of entries.

### FR-BLD-07 Bullets (Experience)

- `BulletListEditor`: each bullet is its own input (max 200) with a Remove icon. An **Add bullet** button appends an empty input and focuses it.
- New entries start with zero bullets. Empty or whitespace bullets are removed on save.

### FR-BLD-08 TagInput (Skills, Project tech)

- Text input plus an **Add** button. **Enter** also adds and never submits the form.
- Input is trimmed. Empty input is ignored. Max 50 characters (hard stop).
- A duplicate (case-insensitive) is rejected with the inline message "“{tag}” is already added", and the input keeps its text.
- Tags render as removable `neutral` Tags. Removing one returns focus to the input.
- For Project tech, at least one tag is required ("Add at least one technology").

### FR-BLD-09 Create mode

- Initial data: empty resume, with `contact.name` pre-filled from `user.name` (empty if null). The pre-fill does **not** count as an unsaved change.
- **Save Resume** (Step 6): validate all steps, then `createResume({ title, content })`. While saving: "Saving…" and every action bar button is disabled.
- Success: clear the dirty state, delete the draft if this session came from one, navigate to `/dashboard`, and show the toast "Resume saved successfully."
- Failure: stay on the step and show the API error toast.

### FR-BLD-10 Edit mode

- On mount: `getResume(id)`. While loading, show skeleton blocks for the StepIndicator and form.
- **404/403:** redirect to `/dashboard` (replace) with the error toast "Resume not found."
- Other errors: redirect to `/dashboard` with the API error toast.
- Loaded data is normalised: any missing `contact`/array keys are filled with defaults. There is no name pre-fill in edit mode.
- A save button is available on every step: **Save Changes** (secondary) on Steps 1–5 and **Save Resume** (primary) on Step 6. Either button:
  1. Validates **all** steps.
  2. If any step is invalid: show the toast "Please complete all required fields", go (replace) to the **first invalid step**, and show its inline errors.
  3. Otherwise call `updateResume(id, { title, content })`. Success and failure behave as in FR-BLD-09.

### FR-BLD-11 Save payload

Trim every string, remove empty bullets, and keep `link: ""` when blank. `title` is sent top-level, and everything else goes inside `content`.

### FR-BLD-12 Unsaved changes protection

- **Dirty** = the current form data differs (deep compare) from the initial data. For a restored draft, the session is dirty from the start.
- **Refresh or closing the tab** while dirty triggers the browser's native `beforeunload` prompt.
- **In-app navigation** that leaves the builder route while dirty opens the **Discard modal**. This covers Cancel, Back to dashboard, Navbar ResumeAI, New Resume, Logout and browser Back on Step 1.
  - Normal session: title "Discard unsaved changes?", body "Your changes will be lost.", buttons **Keep editing** (secondary) and **Discard** (destructive).
  - Restored draft session: title "Discard this draft?", body "This draft will be permanently deleted.", same buttons. Confirming also deletes the draft.
  - **Discard** continues the navigation (Logout then logs out). **Keep editing** or **Esc** cancels it and returns focus to the trigger.
- Step changes inside the builder (same pathname) are never blocked.
- Forced logout (session expiry) and successful saves bypass the modal.

### FR-BLD-13 New Resume while on the builder

Clicking Navbar **New Resume** while on `/resume/new`:

- If dirty: show the Discard modal. On confirm, reset the form to an empty resume (with the name pre-fill) at Step 1.
- If clean: do nothing.

### FR-BLD-14 Import from file

- On the Contact step, between the step heading and the fields: an outlined (secondary) **Import existing resume** button with the Lucide `Upload` icon, plus a hint: "PDF, DOCX or Markdown, up to 5 MB."
- Clicking it opens a file picker limited to `.pdf`, `.docx` and `.md`. Wrong type, an empty file or a file over 5 MB shows an error toast and nothing is uploaded.
- While uploading:
  - the button shows a spinner and "Extracting resume data…" (also announced to screen readers);
  - the contact fields, Next and Save are disabled.
- On success the extracted data is dispatched into the builder reducer (`IMPORT`) and pre-fills all steps:
  - values found in the file replace current ones;
  - anything the file didn't provide keeps its current value (e.g. the name pre-fill);
  - skills are trimmed and de-duplicated, ignoring case.
- Then the toast "Resume imported — review and edit your details" shows and the user stays on Step 1.
- The import counts as unsaved changes, so the Discard modal and drafts apply.
- If the response contains nothing usable: the toast "We couldn't find any resume details in that file." and the form is unchanged.
- Errors use the standard API error toast. Leaving the builder cancels an in-flight upload.
- Available in both create and edit mode.

---

## 6. Drafts

### FR-DRAFT-01 Automatic draft on session expiry

- A draft is saved **only** when a session expires ([FR-AUTH-06](#fr-auth-06-session-expiry)) while the builder is open **and dirty**. Refresh, normal logout and Cancel never create drafts.
- The draft captures the form data, the current step, the mode and the resume id.

### FR-DRAFT-02 Storage rules

- Stored in localStorage per user (`drafts:{userId}`), so drafts exist on this browser and device only.
- **One draft per resume.** A new draft for the same resume (or the same unsaved new-resume session) replaces the older one.
- **Max 10 per user.** When an 11th is saved, the oldest (`savedAt`) is deleted.
- **Expiry:** drafts older than **30 days** are purged whenever drafts are read.

### FR-DRAFT-03 Visibility

Drafts appear in the Overview banner and on the Drafts page ([FR-DASH-07](#fr-dash-07-drafts-banner), [FR-DASH-08](#fr-dash-08-drafts-page-dashboarddrafts)).

### FR-DRAFT-04 Restore draft

- **Create-mode draft:** navigate to `/resume/new` with `state: { draftId, step }`. The form loads the draft data and opens at the saved step.
- **Edit-mode draft:** navigate to `/resume/:id/edit` with `state: { draftId, step }`. The page still calls `getResume(id)` to check the resume exists.
  - If it **exists**: load the **draft data** (not the server data) at the saved step.
  - If it returns **404/403**: delete the draft, redirect to `/dashboard`, and show the error toast "Resume no longer exists."
- Restoring does **not** delete the draft.

### FR-DRAFT-05 Draft deletion

A draft is deleted only when:

- the user saves successfully from the restored session,
- the user clicks Discard on the draft card,
- the user confirms the Discard modal in a restored session,
- its resume is deleted,
- it expires (30 days), or
- it is evicted by the 10-draft limit.

### FR-DRAFT-06 Delete resume removes its draft

Successfully deleting a resume also deletes the draft whose `resumeId` matches.

---

## 7. Analyze (`/resume/:id/analyze`)

### FR-AN-01 Page load

- In parallel: `getResume(id)` and `getAnalyses(id)`. Skeletons show for the header, the result section and the history.
- `getResume` **404/403**: redirect to `/dashboard` with the error toast "Resume not found."
- `getAnalyses` fails while the resume loads: the form still works. The result and history area shows an inline error panel with **Retry**, which refetches analyses.
- Results: `current = analyses[0]` (if any), `history = analyses.slice(1, 6)`.

### FR-AN-02 Header

"← Back to dashboard" link (to `/dashboard`), heading "Analyze: {resume title}", and an **Edit resume** button (secondary, `Pencil`) that goes to `/resume/:id/edit`.

### FR-AN-03 Analyze form

- Textarea labelled "Job description", placeholder "Paste the job description here…". Min 50 characters, max 5,000 (hard stop).
- Counter below: `1,234 / 5,000`. While under 50, the helper text reads "Minimum 50 characters".
- **Analyze** (primary, `Sparkles`) is disabled while the trimmed length is under 50.
- While the request runs:
  - The textarea and button are disabled. The button shows a Spinner and "Analyzing…".
  - After **10 s**, an inline muted message appears below the button: "This is taking longer than usual, please wait..."
  - The request times out at 30 s ([error-handling.md](error-handling.md)).
- Success:
  - The new analysis becomes `current`.
  - `getAnalyses` is refetched, so the history now starts with the previous current analysis.
  - The job description text is **kept**.
  - Focus moves to the result heading.
- Failure: show the error toast. The text is kept, and the form is re-enabled.

### FR-AN-04 Current result (`AnalyzeResult`)

Shown when `current` exists. Otherwise the section shows the muted text "No analysis yet. Paste a job description above to get started." It contains:

1. **ScoreBar**, colored by score: < 50 red, 50–75 amber, > 75 green, with the number "62%" ([design.md §5.5](design.md)).
2. "Analyzed {relative date}".
3. **Missing keywords**: `warning` tags. Empty list: "None. Great coverage!"
4. **Strengths**: `success` tags. Empty list: "None identified."
5. **Suggestions**: numbered list. Empty list: "No suggestions."
6. **Export PDF** button (secondary, `Download`). It is **hidden** when there is no current analysis.

### FR-AN-05 Analysis history

- Heading "Previous analyses". Shows up to 5 rows (`history`). With none: "No previous analyses."
- Each row is a collapsible button (`aria-expanded`). Collapsed, it shows the **date** (relative) and **match score** ("62%", plus a small colored score dot). Expanding it shows the missing keywords, strengths and suggestions, styled as in FR-AN-04 but **without** the ScoreBar or Export.
- Rows are collapsed by default, and several can be open at once.
- History rows cannot be exported.

### FR-AN-06 Export PDF

- Exports **the current result only**. jsPDF is loaded on click via dynamic `import("jspdf")`. The button shows "Exporting…" while it loads.
- **Filename:** `{slug(resume title)}-analysis-{YYYY-MM-DD}.pdf`.
  - The date is the analysis `created_at` in local time.
  - slug: lowercase, non-alphanumerics become `-`, repeated dashes collapse, leading and trailing dashes are trimmed; empty becomes `resume`.
- **Content** (clean text, section headings, automatic page breaks, empty sections omitted):
  1. Contact name (large), then a line `email · phone · location`.
  2. Resume title.
  3. Summary.
  4. Experience: role at company, duration, `•` bullets.
  5. Education: degree, institution, year.
  6. Skills: comma-separated.
  7. Projects: name, description, "Tech: …", link.
  8. A divider, then **Analysis**: date, "Match score: 62%", missing keywords, strengths, numbered suggestions.
- Uses the resume data loaded on the Analyze page (the saved version).

### FR-AN-07 Incomplete resumes

Analysis is allowed for any resume, however empty. There is no warning.

---

### FR-AN-08 Analyze picker (`/analyze`)

- Heading "Select a resume to analyze", plus a short subtitle.
- One card per resume (same grid as the dashboard), each showing:
  - the title;
  - "Created …";
  - "Last analyzed …", "Never analyzed", or "Last analyzed: unavailable" if its analyses failed to load (a skeleton line while loading);
  - a primary **Analyze** button → `/resume/:id/analyze`. Its link is stretched over the card, so the whole card is clickable with one tab stop.
- While loading: 6 skeleton cards. With no resumes: the empty state "You have no resumes yet." with a **Create Resume** button. If loading fails: ErrorPanel with Retry.

---

## 8. Not found and errors

### FR-404-01 Not-found page

- Any unmatched route renders inside PublicLayout.
- Heading "Page not found". Text "Page not found. This page doesn't exist or was moved."
- Link: authenticated users get **Go to dashboard** (`/dashboard`). Logged-out users get **Go to login** (`/login`).

### FR-ERR-01 Crash fallback

A root Error Boundary catches render errors and shows "Something went wrong." with a **Reload** button (`window.location.reload()`). See [error-handling.md](error-handling.md).

---

## 9. General behaviors

### FR-GEN-01 Loading states

Every async action shows loading state: buttons show a spinner, loading text and are disabled; pages show skeletons. Pages that load lazily show a centered Spinner via the Suspense fallback.

### FR-GEN-02 Feedback

- **Toasts** (react-hot-toast, 4 s): all success messages and all API, network and timeout errors.
- **Inline:** form validation errors only, under the field.
- All toast and validation strings live in `src/constants/index.js`.

### FR-GEN-03 Double-submit prevention

Buttons are disabled while their request is pending. Enter on a form does nothing while it's submitting.

### FR-GEN-04 Date formatting

`utils/dateUtils.js` → `formatRelativeDate(iso)`:

- within 30 days: `date-fns` `formatDistanceToNow(date, { addSuffix: true })`, e.g. "2 days ago".
- older: `format(date, "MMM d, yyyy")`, e.g. "Nov 13, 2026".

Used by resume cards, draft cards, the current analysis and history rows.

### FR-GEN-05 External links

Project links (when rendered) open in a new tab with `rel="noopener noreferrer"` and must be `http(s)`.

---

## 10. Public site

### FR-PUB-01 Landing page (`/`)

Uses `LandingLayout` (full width, no sidebar, no auth required). Sections in order:

1. **Navbar:** logo, anchors (How It Works · Features · FAQ), ThemeToggle, Login (secondary) and Get Started (primary, `/register`).
   - Logged in: a single "Go to dashboard" button replaces Login and Get Started.
   - Below `md`, the links and buttons collapse into a hamburger menu (Esc closes it).
2. **Hero:** headline, subheadline, "Get Started Free" (primary, `/register`), "See How It Works" (secondary, `#how-it-works`), and a decorative analysis preview.
3. **How It Works:** 3 numbered steps with Lucide icons.
4. **Features:** cards for resume builder, AI analysis, match score, PDF export, file import and analysis history.
5. **FAQ:** native `<details>` accordion, 6 questions.
6. **Footer:** logo, description, Privacy Policy and Terms and Conditions links, copyright.

Anchors scroll smoothly (except with reduced motion) and sections have `scroll-mt-16` to clear the sticky navbar.

### FR-PUB-02 Legal pages

`/privacy-policy` and `/terms-and-conditions` use `PublicLayout` and the shared `LegalPage` frame (title, "Last updated" date, prose styles).

- `CONTACT_EMAIL` and `LEGAL_LAST_UPDATED` live in constants.
- `CONTACT_EMAIL` is a **placeholder** and must be replaced before launch. The text should get a legal review.
