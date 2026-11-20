import { useCallback, useEffect, useRef } from "react"
import { useBlocker } from "react-router-dom"
import { useAuth } from "./useAuth"

// Blocks leaving the builder route while dirty (docs/state-management.md §8).
// Same-pathname navigations (step changes) are never blocked.
export function useUnsavedChanges(isDirty) {
  const { isAuthenticated } = useAuth()
  const bypassRef = useRef(false)

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isDirty &&
        isAuthenticated &&
        !bypassRef.current &&
        currentLocation.pathname !== nextLocation.pathname,
      [isDirty, isAuthenticated]
    )
  )

  useEffect(() => {
    if (!isDirty) return undefined
    const handler = (event) => {
      if (bypassRef.current) return
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  // Call right before a navigation that must not be blocked (e.g. after a successful save).
  const bypass = useCallback(() => {
    bypassRef.current = true
  }, [])

  return { blocker, bypass }
}
