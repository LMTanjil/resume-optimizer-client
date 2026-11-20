# API Contracts

The source of truth for every request and response between the frontend and the existing backend.
Base spec: [resume-optimizer-frontend-spec.md](resume-optimizer-frontend-spec.md) → "API Service".
Related: [error-handling.md](error-handling.md), [state-management.md](state-management.md).

---

## 1. General

| Item            | Value                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Base URL        | `import.meta.env.VITE_API_URL` (never hardcoded; local default `http://localhost:5000/api`)                     |
| Format          | JSON request and response bodies                                                                                |
| Auth            | `Authorization: Bearer <token>` header, added by the axios request interceptor when `localStorage.token` exists |
| Default timeout | **10 000 ms** for every request                                                                                 |
| Analyze timeout | **30 000 ms** for `POST /analyze` only (passed per request)                                                     |
| Error body      | `{ "error": "message here" }` on every non-2xx response                                                         |

Every call lives in `src/services/api.js`. Components never import axios.

---

## 2. Required backend changes

> ⚠️ The backend team (or another session working in the backend repo) must apply these. The frontend is built against the **post-change** contract.

### 2.1 `name` on users — **REQUIRED, needs a migration** (backend handoff brief)

> This section is self-contained. Hand it to the backend session as-is.
> The frontend docs never looked at the backend code. Where its framework or query layer matters, the brief says what has to be true, not how to code it.

**Goal:** users have a display name. The name is collected at registration and returned in every auth response.

**1. Database migration** (PostgreSQL, since `content` is JSONB)

```sql
ALTER TABLE users ADD COLUMN name VARCHAR(100);
```

- The column is **nullable at the database level**, so existing rows stay valid (they get `NULL`). Do not backfill.
- "Required" is enforced in the register handler (step 2), not by a `NOT NULL` constraint.
- Rollback: `ALTER TABLE users DROP COLUMN name;`

**2. `POST /auth/register`**

- Request body: `{ "name": string, "email": string, "password": string }`.
- Validation, in this order, **before** the existing email and password checks:

  | Condition                                         | Status | Body                                                 |
  | ------------------------------------------------- | ------ | ---------------------------------------------------- |
  | `name` missing, not a string, or empty after trim | 400    | `{ "error": "Name is required" }`                    |
  | trimmed length < 2                                | 400    | `{ "error": "Name must be at least 2 characters" }`  |
  | trimmed length > 100                              | 400    | `{ "error": "Name must be at most 100 characters" }` |

- Store the **trimmed** name.
- All existing behavior is unchanged: email and password validation, the duplicate-email error, hashing, JWT creation.

**3. Responses that include `user`**

Both `POST /auth/register` and `POST /auth/login` return:

```json
{
  "token": "<jwt>",
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@x.com", "created_at": "..." }
}
```

- Every query or serializer that builds this `user` object must include `name`. Check any explicit column lists (`SELECT id, email, created_at …`) and `RETURNING` clauses.
- `name` is `null` for accounts created before the migration. Return `null`; don't omit the key or replace it with something else.
- Never include `password` or its hash.
- The JWT payload does **not** need to change.

**4. Out of scope:** updating names, a profile endpoint, and changes to any resume or analyze endpoint.

**5. Acceptance checks**

| #   | Request                                             | Expected                                                 |
| --- | --------------------------------------------------- | -------------------------------------------------------- |
| 1   | Register `{ name: "  Jane Doe ", email, password }` | 2xx; `user.name === "Jane Doe"`                          |
| 2   | Register with no `name`                             | 400 `{ "error": "Name is required" }`                    |
| 3   | Register with `name: "J"`                           | 400 `{ "error": "Name must be at least 2 characters" }`  |
| 4   | Register with a 101-character name                  | 400 `{ "error": "Name must be at most 100 characters" }` |
| 5   | Login as the user from check 1                      | `user.name === "Jane Doe"`                               |
| 6   | Login as a pre-migration user                       | 2xx; `user.name === null`                                |

**Frontend behavior while the backend change isn't deployed yet:**

- If the backend **ignores unknown body fields** (the usual default), register keeps working. `name` is silently dropped, and greetings fall back to the email prefix. Nothing breaks.
- If the backend **rejects unknown fields** (strict schema validation), register fails with that 400 until the change lands. Login is unaffected either way.

### 2.2 `contact` inside resume `content` — **no backend change needed**

`content` is a free-form JSONB column, so the backend stores `content.contact` as-is. This section only documents the shape so both sides agree.

---

## 3. Shared objects

### 3.1 User

```json
{ "id": 1, "name": "Jane Doe", "email": "test@gmail.com", "created_at": "2026-11-13T10:00:00.000Z" }
```

| Field      | Type           | Notes                                      |
| ---------- | -------------- | ------------------------------------------ |
| id         | number         |                                            |
| name       | string \| null | null only for accounts created before §2.1 |
| email      | string         |                                            |
| created_at | ISO string     |                                            |

### 3.2 Resume

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Frontend Developer Resume",
  "content": {
    "contact": {
      "name": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "github": "",
      "website": ""
    },
    "summary": "",
    "experience": [],
    "education": [],
    "skills": [],
    "projects": []
  },
  "created_at": "2026-11-13T10:00:00.000Z",
  "updated_at": "2026-11-13T10:00:00.000Z"
}
```

`title` is a **top-level** field (edited in builder Step 2), not part of `content`.

#### Item shapes and frontend validation

All strings are trimmed before saving. Limits are hard limits (`maxLength`; typing stops at the limit).

**contact**

| Field    | Type   | Required | Max | Rules                                                   |
| -------- | ------ | -------- | --- | ------------------------------------------------------- |
| name     | string | ✅       | 100 |                                                         |
| email    | string | ✅       | 254 | email format                                            |
| phone    | string | —        | 30  | no format check                                         |
| location | string | —        | 100 |                                                         |
| linkedin | string | —        | 200 | http(s) URL; `https://` added if typed without a scheme |
| github   | string | —        | 200 | http(s) URL; `https://` added if typed without a scheme |
| website  | string | —        | 200 | http(s) URL; `https://` added if typed without a scheme |

The frontend always sends all seven keys (empty ones as `""`). The backend (commit `b4510ad`) accepts the same seven string fields but enforces neither the required fields nor the limits; those are frontend-only.

**title / summary**

| Field   | Type   | Required | Max |
| ------- | ------ | -------- | --- |
| title   | string | ✅       | 100 |
| summary | string | —        | 500 |

**experience[]**

```json
{ "company": "", "role": "", "duration": "Jan 2023 - Present", "bullets": [""] }
```

| Field    | Type     | Required | Max      | Notes                                            |
| -------- | -------- | -------- | -------- | ------------------------------------------------ |
| company  | string   | ✅       | 100      |                                                  |
| role     | string   | ✅       | 100      |                                                  |
| duration | string   | ✅       | 50       | free text, a single string                       |
| bullets  | string[] | —        | 200 each | empty bullets are removed on save; `[]` is valid |

**education[]**

```json
{ "institution": "", "degree": "", "year": "2024" }
```

| Field       | Type   | Required | Max |
| ----------- | ------ | -------- | --- |
| institution | string | ✅       | 100 |
| degree      | string | ✅       | 100 |
| year        | string | —        | 50  |

**skills**: `string[]`, each item at most 50 characters, no case-insensitive duplicates. `[]` is valid.

**projects[]**

```json
{ "name": "", "description": "", "tech": [""], "link": "" }
```

| Field       | Type     | Required     | Max     | Notes                                                                             |
| ----------- | -------- | ------------ | ------- | --------------------------------------------------------------------------------- |
| name        | string   | ✅           | 100     |                                                                                   |
| description | string   | ✅           | 500     |                                                                                   |
| tech        | string[] | ✅ (≥ 1 tag) | 50 each | no case-insensitive duplicates                                                    |
| link        | string   | —            | 2048    | if present, must be a valid `http://` or `https://` URL; empty string when absent |

Array sections (`experience`, `education`, `projects`) may be empty (`[]`).

**Backward compatibility:** resumes created before `contact` existed may omit it. When loading, the frontend fills in any missing `contact`/array keys with the empty defaults above.

### 3.3 Analysis

```json
{
  "id": 1,
  "resume_id": 1,
  "match_score": 33,
  "missing_keywords": ["Docker", "GraphQL"],
  "suggestions": ["Quantify impact in your experience bullets."],
  "strengths": ["React", "REST APIs"],
  "created_at": "2026-11-13T10:00:00.000Z"
}
```

`match_score` is an integer from 0 to 100. The job description is **not** returned, and the UI never shows it for past analyses.

---

## 4. Endpoints

### 4.1 Auth

#### `POST /auth/register`

|          |                                                                        |
| -------- | ---------------------------------------------------------------------- |
| Function | `register(name, email, password)`                                      |
| Body     | `{ "name": "Jane Doe", "email": "jane@x.com", "password": "secret1" }` |
| 2xx      | `{ "token": "<jwt>", "user": User }`                                   |
| Errors   | 400/409 `{ error }` (e.g. email already registered)                    |

The user is logged in immediately: `login(token, user)` runs, then the app navigates to `/dashboard`.

#### `POST /auth/login`

|          |                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Function | `login(email, password)`                                                                               |
| Body     | `{ "email": "jane@x.com", "password": "secret1" }`                                                     |
| 2xx      | `{ "token": "<jwt>", "user": User }`                                                                   |
| Errors   | 400/401 `{ error }`. **A 401 here shows the API message and never triggers session-expired handling.** |

**Display name rule:** `user.name` if it's present and non-empty. Otherwise use the part of `user.email` before `@`.

### 4.2 Resumes

| Function                 | Method & path         | Body                 | 2xx response                                                |
| ------------------------ | --------------------- | -------------------- | ----------------------------------------------------------- |
| `getResumes()`           | `GET /resumes`        | —                    | `Resume[]` (the frontend sorts by `created_at` desc itself) |
| `getResume(id)`          | `GET /resumes/:id`    | —                    | `Resume`                                                    |
| `createResume(data)`     | `POST /resumes`       | `{ title, content }` | `Resume`                                                    |
| `updateResume(id, data)` | `PUT /resumes/:id`    | `{ title, content }` | `Resume`                                                    |
| `deleteResume(id)`       | `DELETE /resumes/:id` | —                    | any 2xx                                                     |

`GET /resumes/:id` returns **404 or 403** for a missing resume or one owned by someone else. The frontend treats both the same way: "Resume not found." See [user-flow.md](user-flow.md).

### 4.3 Analyze

| Function                                  | Method & path                  | Body                           | 2xx response                                                         |
| ----------------------------------------- | ------------------------------ | ------------------------------ | -------------------------------------------------------------------- |
| `analyzeResume(resumeId, jobDescription)` | `POST /analyze` (timeout 30 s) | `{ resumeId, jobDescription }` | `Analysis`                                                           |
| `getAnalyses(resumeId)`                   | `GET /analyze/:resumeId`       | —                              | `Analysis[]`, **newest first** (backend orders by `created_at DESC`) |

The frontend splits `getAnalyses` results as follows:

- `analyses[0]` is the **current result** (main result section).
- `analyses.slice(1, 6)` is the **history**: the 5 analyses before the current one.

`jobDescription` is 50–5000 characters (validated by the frontend).

### 4.4 Import — **new backend endpoint**

| Function                       | Method & path                        | Body                                | 2xx response          |
| ------------------------------ | ------------------------------------ | ----------------------------------- | --------------------- |
| `importResume(file, {signal})` | `POST /resume/import` (timeout 30 s) | `multipart/form-data`, field `file` | `{ title?, content }` |

- Path is relative to `VITE_API_URL`, so the full URL is `/api/resume/import`. Note it is **singular** `resume`, unlike `/resumes`.
- Accepted files: `.pdf`, `.docx`, `.md`, up to 5 MB. The frontend checks both before uploading. The backend should still reject anything else with a 400 `{ error }`, and its message is shown as a toast.
- `content` uses the same shape as §3.2. Any key may be missing or empty. A bare `content` object (without the wrapper) is also accepted.
- Nothing is saved. The frontend only fills the builder form with the result.
- Requires auth. A 401 triggers the normal session-expired handling.

---

## 5. `api.js` reference implementation shape

```js
import axios from "axios"
import { API_TIMEOUT_MS, ANALYZE_TIMEOUT_MS, STORAGE_KEYS } from "../constants"
import { emitSessionExpired } from "../utils/authEvents"

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: API_TIMEOUT_MS })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith("/auth/")
    const hadToken = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 401 && hadToken && !isAuthEndpoint) {
      error.isSessionExpired = true
      emitSessionExpired()
    }
    return Promise.reject(error)
  }
)

export default api

export const register = (name, email, password) =>
  api.post("/auth/register", { name, email, password })
export const login = (email, password) => api.post("/auth/login", { email, password })

export const getResumes = () => api.get("/resumes")
export const getResume = (id) => api.get(`/resumes/${id}`)
export const createResume = (data) => api.post("/resumes", data)
export const updateResume = (id, data) => api.put(`/resumes/${id}`, data)
export const deleteResume = (id) => api.delete(`/resumes/${id}`)

export const analyzeResume = (resumeId, jobDescription) =>
  api.post("/analyze", { resumeId, jobDescription }, { timeout: ANALYZE_TIMEOUT_MS })
export const getAnalyses = (resumeId) => api.get(`/analyze/${resumeId}`)
```

Differences from the original spec: `register` gains `name`; a default timeout is set; analyze uses a 30 s timeout; and a 401 response interceptor is added.
