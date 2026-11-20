# Design System

Visual language for **ResumeAI**. Base spec: [resume-optimizer-frontend-spec.md](resume-optimizer-frontend-spec.md) → "Theme — Light/Dark Toggle".
Accessibility targets are in [non-functional-requirements.md](non-functional-requirements.md). Component names match [component-tree.md](component-tree.md).

**Feel:** clean, clear, uncluttered. A productivity tool, not a landing page. Every screen has one obvious primary action.

---

## 1. Color tokens

### 1.1 Token table (final)

| Token           | CSS variable            | Light                 | Dark (navy)     | Used for                                                              |
| --------------- | ----------------------- | --------------------- | --------------- | --------------------------------------------------------------------- |
| Page background | `--color-bg`            | `#FFFBF2` cream white | `#0B1530` navy  | `<body>`                                                              |
| Card / surface  | `--color-surface`       | `#FFFFFF`             | `#13213F`       | cards, panels, modals, navbar, inputs                                 |
| Muted surface   | `--color-muted`         | `#FAF0D7` vanilla     | `#1B2B52`       | hover fills, skill tags, skeletons, score-bar track                   |
| Border          | `--color-border`        | `#EADFC4`             | `#26385F`       | card, input and divider borders                                       |
| Text            | `--color-text`          | `#1A1F2E`             | `#FFF8E7` cream | body and headings                                                     |
| Muted text      | `--color-text-muted`    | `#5B6275`             | `#B8BFD3`       | meta, helper text, counters, ghost buttons                            |
| Primary         | `--color-primary`       | `#D50032`             | `#D50032`       | primary button fill, red text and links                               |
| Primary hover   | `--color-primary-hover` | `#B0002A`             | `#E0103A`       | primary button hover                                                  |
| Neon accent     | `--color-accent`        | `#FF1744`             | `#FF1744`       | logo text, focus rings, input focus border, active StepIndicator step |
| Warning red     | `--color-warning`       | `#C62828`             | `#F87171`       | Delete button, score < 50, missing-keyword tags, field errors         |
| Success green   | `--color-success`       | `#15803D`             | `#4ADE80`       | score > 75, strength tags                                             |
| Amber           | `--color-amber`         | `#F59E0B`             | `#F59E0B`       | score 50–75 (bar fill only, never text)                               |

Tag tints (backgrounds for semantic tags):

| Token                  | Light     | Dark                        |
| ---------------------- | --------- | --------------------------- |
| `--color-warning-tint` | `#FDF0F0` | `rgba(248, 113, 113, 0.15)` |
| `--color-success-tint` | `#F0FAF3` | `rgba(74, 222, 128, 0.15)`  |

### 1.2 Contrast rules (verified)

| Pair                                             | Ratio   | Result                                                    |
| ------------------------------------------------ | ------- | --------------------------------------------------------- |
| White on `#D50032` (primary button, both themes) | 5.4:1   | AA ✅                                                     |
| White on `#E0103A` (dark primary hover)          | 4.9:1   | AA ✅                                                     |
| `#C62828` on cream / white                       | ≥ 5.6:1 | AA ✅                                                     |
| `#F87171` on navy                                | ≈ 6.5:1 | AA ✅                                                     |
| `#15803D` on `#F0FAF3`                           | ≈ 4.7:1 | AA ✅                                                     |
| Neon `#FF1744` on cream                          | ≈ 3.8:1 | non-text / large only. **Never body text in light mode.** |
| Amber `#F59E0B` on cream                         | ≈ 2.2:1 | decorative only. The score is always shown as a number.   |

**Rule:** neon red `#FF1744` is an _accent_. Never put white text on a neon-red fill.

### 1.3 Implementation

Define the variables on `:root` (light) and `html.dark` (dark) in `src/index.css`, and map them in `tailwind.config.js`:

```js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        text: { DEFAULT: "var(--color-text)", muted: "var(--color-text-muted)" },
        primary: { DEFAULT: "var(--color-primary)", hover: "var(--color-primary-hover)" },
        accent: "var(--color-accent)",
        warning: { DEFAULT: "var(--color-warning)", tint: "var(--color-warning-tint)" },
        success: { DEFAULT: "var(--color-success)", tint: "var(--color-success-tint)" },
        amber: "var(--color-amber)",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      maxWidth: { content: "1280px" },
    },
  },
  plugins: [],
}
```

Components use token classes only (`bg-surface`, `text-text-muted`, `border-border`). They never use raw hex values or `dark:` color overrides, because the variables already switch with the theme.

### 1.4 Theme behavior

- No stored preference: follow the OS (`prefers-color-scheme`), and react live to OS changes.
- After the user toggles: store `"light"` or `"dark"` in `localStorage.theme`. That value wins from then on.
- An inline script in `index.html` applies `class="dark"` to `<html>` **before** React mounts, so the page never flashes the wrong theme.
- Changing theme animates `background-color` and `color` over 200 ms. This is disabled under reduced motion.

---

## 2. Typography

- **Font:** Inter from Google Fonts, weights 400, 500, 600 and 700, `display=swap`. Headings and body use the same font.
- **Base size:** 16px.

| Role                           | Tailwind                         | Size / weight                                                                                               |
| ------------------------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Page title (h1)                | `text-2xl md:text-3xl font-bold` | 24/30px, 700                                                                                                |
| Section title (h2)             | `text-xl font-semibold`          | 20px, 600                                                                                                   |
| Card / step title (h3)         | `text-lg font-semibold`          | 18px, 600                                                                                                   |
| Body                           | `text-base`                      | 16px, 400                                                                                                   |
| Labels, buttons                | `text-sm font-medium`            | 14px, 500                                                                                                   |
| Meta, helper, counters, errors | `text-sm`                        | 14px, 400                                                                                                   |
| Logo "ResumeAI"                | `text-xl font-bold`              | color `accent` (`#FF1744`) in both themes. 20px bold counts as WCAG large text, so 3:1 is enough and passes |

Line height uses Tailwind defaults. Long text (summaries, suggestions) uses `leading-relaxed`.

---

## 3. Spacing and layout

**Density:** balanced. The Tailwind default 4px scale is used.

| Element                              | Value                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| Content container                    | `max-w-content mx-auto` (1280px), centered                                      |
| Page side gutter                     | `px-4` (16px) mobile · `md:px-6` · `lg:px-8`                                    |
| Page vertical padding                | `py-6 md:py-8`                                                                  |
| Navbar height                        | 64px (`h-16`)                                                                   |
| Card padding                         | `p-4 md:p-6`                                                                    |
| Gap between form fields              | `gap-4`                                                                         |
| Gap between page sections            | `gap-8`                                                                         |
| Dashboard grid                       | `grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`                          |
| Form column (builder, auth, analyze) | `max-w-3xl` builder / analyze, `max-w-md` auth pages, centered                  |
| Breakpoints                          | Tailwind defaults: `sm` 640, `md` 768, `lg` 1024. Minimum supported width 375px |

---

## 4. Shape, elevation and motion

- **Radius:** `rounded-lg` (8px) on cards, inputs, buttons and modals. `rounded-full` on tags, step circles and the score bar.
- **Cards and panels:** `bg-surface border border-border shadow-sm`. In dark mode the border carries the definition.
- **Card hover:** `hover:shadow-md`, transition 150 ms.
- **Modal:** `shadow-xl`, overlay `bg-black/50`.
- **Motion:** use Tailwind transitions only (no animation library).
  - Buttons, links, inputs: `transition-colors duration-150`.
  - Builder step change: **fade**, opacity 0 → 1 over 200 ms.
  - Modal: fade plus a slight scale, 150 ms.
  - Skeletons: `animate-pulse`.
  - All motion is wrapped in `motion-safe:` or disabled by a global `prefers-reduced-motion` rule.

---

## 5. Components

### 5.1 Buttons (`ui/Button.jsx`)

Base: `h-10 px-4 rounded-lg text-sm font-medium inline-flex items-center gap-2`. Icon-only variant: `h-10 w-10`, always with an `aria-label`.

| Variant       | Light                                                           | Dark                                         | Used for                                                                                                                      |
| ------------- | --------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `primary`     | solid `#D50032`, white text, hover `#B0002A`                    | solid `#D50032`, white text, hover `#E0103A` | Save Resume (Step 6, both modes), Analyze, Next, Log in, Create account, Create Resume (empty state), Restore                 |
| `secondary`   | transparent, border and text `--color-text`, hover `bg-muted`   | same tokens                                  | Navbar New Resume, Back, Edit, Edit resume, Save Changes (edit mode, Steps 1–5), Retry, Export PDF, View drafts, Keep editing |
| `destructive` | transparent, border and text `#C62828`, hover `bg-warning-tint` | border and text `#F87171`                    | Delete, Discard (modal confirm and draft card)                                                                                |
| `ghost`       | no border, `text-text-muted`, hover `bg-muted`                  | same                                         | Cancel, Logout, modal Cancel, ThemeToggle                                                                                     |

States:

- **Focus-visible:** `ring-2 ring-accent ring-offset-2 ring-offset-bg`.
- **Disabled:** `opacity-50 cursor-not-allowed`, no hover.
- **Loading:** shows `Spinner` plus loading text, is disabled, and keeps its width (e.g. "Saving…", "Analyzing…", "Deleting…", "Logging in…", "Creating account…").

### 5.2 Inputs (`ui/Input.jsx`, `ui/Textarea.jsx`, `ui/FormField.jsx`)

- `h-10 px-3 rounded-lg bg-surface border border-border text-base`, placeholder `text-text-muted`.
- **Focus:** `border-accent ring-2 ring-accent/30` (neon border plus soft glow).
- **Error:** `border-warning`. The message sits below in `text-sm text-warning` and is linked with `aria-describedby`.
- **Label:** above the field, `text-sm font-medium`. Required fields show `*` (with `aria-hidden`; the input has `required`/`aria-required`).
- **Character counter** (summary, project description, job description): right-aligned `text-sm text-text-muted`, format `123 / 500`, numbers with thousands separators (`1,234 / 5,000`).
- **Textarea:** `min-h-32`, vertical resize only. Job description `min-h-48`.

### 5.3 Tags (`ui/Tag.jsx`)

`rounded-full px-3 py-1 text-sm font-medium inline-flex items-center gap-1`.

| Variant   | Background                       | Text           | Used for           |
| --------- | -------------------------------- | -------------- | ------------------ |
| `neutral` | `bg-muted` (vanilla / `#1B2B52`) | `text-text`    | skills, tech stack |
| `warning` | `bg-warning-tint`                | `text-warning` | missing keywords   |
| `success` | `bg-success-tint`                | `text-success` | strengths          |

Removable tags show a Lucide `X` icon button (16px, `aria-label="Remove {tag}"`).

### 5.4 Cards

`ResumeCard` / `DraftCard`: surface card. Title (`h3`, truncated to 2 lines), meta line in muted text ("Created 2 days ago"), and an action row at the bottom. The whole card is clickable using a stretched-link pattern; buttons sit above the link layer.

### 5.5 Score bar (`analyze/ScoreBar.jsx`)

- Track: `h-3 rounded-full bg-muted`. Fill width = score %.
- Fill color: **< 50** warning red · **50–75 inclusive** amber · **> 75** success green.
- The number `62%` sits to the right in `text-2xl font-bold text-text` (never colored). The label "Match score" sits above.
- Uses `role="progressbar"` with `aria-valuenow/min/max` and `aria-label="Match score"`.

### 5.6 StepIndicator (`resume/StepIndicator.jsx`)

- 6 numbered circles (32px, `rounded-full`) joined by 2px lines.
- **Completed:** fill `primary`, white Lucide `Check`. Line after it is `primary`.
- **Active:** 2px `accent` (neon red) border, `bg-surface`, number in `text-text font-semibold`.
- **Upcoming:** `border-border`, number in `text-text-muted`.
- Labels under the circles at `md+`. Below `md`, a single line: "Step 2 of 6 · Basic Info".
- Display only, not clickable. Rendered as an `<ol>` with `aria-current="step"` on the active step.

### 5.7 Modal (`ui/Modal.jsx`)

Centered panel `max-w-md w-[calc(100%-2rem)] bg-surface rounded-lg p-6`. Title `h2 text-lg font-semibold`, body text, and actions right-aligned (Cancel, then the confirm button).

### 5.8 Navbar (`common/Navbar.jsx`)

- `h-16 bg-surface border-b border-border`, content inside the 1280px container.
- **Authenticated** (inside `AppLayout`): `[☰ mobile] [ResumeAI] ····· [ThemeToggle] [avatar]`
  - Navigation lives in the sidebar. Logout is in the avatar's profile menu, in warning red.
  - Avatar: a 36px circle with the user's initial on one of 8 fixed WCAG AA color pairs, chosen by hashing the email.
  - The Navbar never has a filled primary button, so it doesn't compete with the page's primary action.
- **Public:** `[ResumeAI] ····· [ThemeToggle]`.

### 5.9 Skeletons (`ui/Skeleton.jsx`)

`bg-muted rounded-lg animate-pulse` blocks shaped like the content they replace (card skeleton: title bar, meta bar, button row).

### 5.10 Toasts

Use `react-hot-toast` `<Toaster position="top-center" />`, 4 s duration. Styled with tokens: `bg-surface text-text border border-border shadow-md rounded-lg`. The success icon uses `success` and the error icon uses `warning`.

### 5.11 Banner (`dashboard/DraftsBanner.jsx`)

Full-width strip under the Overview heading: `bg-muted border border-border rounded-lg p-4`, a Lucide `FileClock` icon, text, a "View drafts" link-button (secondary) and a dismiss `X` (ghost icon, `aria-label="Dismiss"`).

### 5.12 Dashboard sections

There are no dashboard tabs. Overview, My Resumes and Drafts are separate routes, reached from the sidebar (see functional-requirements.md FR-NAV-05).

---

## 6. Icons

**Lucide React**. Default size 18px in buttons and 16px in tags, `stroke-width` 2, color `currentColor`. Decorative icons get `aria-hidden="true"`.

| Use                                 | Icon                                            |
| ----------------------------------- | ----------------------------------------------- |
| Theme toggle                        | `Sun` (shown in dark) / `Moon` (shown in light) |
| New resume / add entry / add bullet | `Plus`                                          |
| Logout                              | `LogOut`                                        |
| Edit                                | `Pencil`                                        |
| Analyze                             | `Sparkles`                                      |
| Delete / remove entry               | `Trash2`                                        |
| Remove tag, dismiss                 | `X`                                             |
| Back links                          | `ArrowLeft`                                     |
| Next / Back step                    | `ArrowRight` / `ArrowLeft`                      |
| Export PDF                          | `Download`                                      |
| History row expand                  | `ChevronDown` (rotates 180° when open)          |
| Drafts banner                       | `FileClock`                                     |
| Completed step                      | `Check`                                         |
| Error state                         | `AlertCircle`                                   |
