import { useCallback, useState } from "react"
import { DRAFT_TTL_DAYS, MAX_DRAFTS, STORAGE_KEYS } from "../constants"
import { daysSince } from "../utils/dateUtils"

// Drafts are saved only when a session expires mid-edit (docs/state-management.md §6).
// Storage is synchronous so it can run inside the session-expiry callback.

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    try {
      localStorage.removeItem(key)
    } catch {
      /* storage unavailable */
    }
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

const bySavedAtDesc = (a, b) => new Date(b.savedAt) - new Date(a.savedAt)

// Reads drafts, purging expired ones; always returns newest first.
export function readDrafts(userId) {
  if (userId == null) return []
  const key = STORAGE_KEYS.drafts(userId)
  const stored = readJson(key, [])
  const list = Array.isArray(stored) ? stored : []
  const fresh = list.filter((draft) => draft?.id && daysSince(draft.savedAt) <= DRAFT_TTL_DAYS)
  if (fresh.length !== list.length) writeJson(key, fresh)
  return fresh.sort(bySavedAtDesc)
}

function writeDrafts(userId, drafts) {
  writeJson(STORAGE_KEYS.drafts(userId), drafts)
}

// Upsert: one draft per resume (edit) or per builder session (create); cap at MAX_DRAFTS.
export function saveDraftFor(userId, draft) {
  if (userId == null) return []
  const isSameTarget = (existing) =>
    draft.mode === "edit"
      ? existing.mode === "edit" && String(existing.resumeId) === String(draft.resumeId)
      : existing.mode === "create" && existing.sessionKey === draft.sessionKey
  const others = readDrafts(userId).filter((existing) => !isSameTarget(existing))
  const next = [{ ...draft, savedAt: new Date().toISOString() }, ...others]
    .sort(bySavedAtDesc)
    .slice(0, MAX_DRAFTS)
  writeDrafts(userId, next)
  return next
}

export function useDrafts(userId) {
  const [drafts, setDrafts] = useState(() => readDrafts(userId))
  const [dismissedAt, setDismissedAt] = useState(() =>
    userId == null ? null : readJson(STORAGE_KEYS.draftsBannerDismissedAt(userId), null)
  )

  const refresh = useCallback(() => setDrafts(readDrafts(userId)), [userId])

  const saveDraft = useCallback((draft) => setDrafts(saveDraftFor(userId, draft)), [userId])

  const deleteDraft = useCallback(
    (id) => {
      const next = readDrafts(userId).filter((draft) => draft.id !== id)
      writeDrafts(userId, next)
      setDrafts(next)
    },
    [userId]
  )

  const deleteDraftForResume = useCallback(
    (resumeId) => {
      const next = readDrafts(userId).filter(
        (draft) => !(draft.mode === "edit" && String(draft.resumeId) === String(resumeId))
      )
      writeDrafts(userId, next)
      setDrafts(next)
    },
    [userId]
  )

  const getDraft = useCallback(
    (id) => readDrafts(userId).find((draft) => draft.id === id) ?? null,
    [userId]
  )

  const dismissBanner = useCallback(() => {
    const now = new Date().toISOString()
    writeJson(STORAGE_KEYS.draftsBannerDismissedAt(userId), now)
    setDismissedAt(now)
  }, [userId])

  const newest = drafts[0]
  const showBanner =
    drafts.length > 0 && (!dismissedAt || new Date(newest.savedAt) > new Date(dismissedAt))

  return {
    drafts,
    saveDraft,
    deleteDraft,
    deleteDraftForResume,
    getDraft,
    refresh,
    showBanner,
    dismissBanner,
  }
}
