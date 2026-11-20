import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { STORAGE_KEYS, TOAST_MESSAGES } from "../constants"
import { onSessionExpired } from "../utils/authEvents"
import { getDisplayName } from "../utils/user"

// Global auth state — the only context in the app (docs/state-management.md §3).
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

function readStoredSession() {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null")
    if (token && user && typeof user === "object") return { token, user }
  } catch {
    /* corrupted storage — fall through and clear */
  }
  try {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
  } catch {
    /* storage unavailable */
  }
  return { token: null, user: null }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession)
  const handlingExpiry = useRef(false)

  const login = useCallback((token, user) => {
    localStorage.setItem(STORAGE_KEYS.token, token)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    handlingExpiry.current = false
    setSession({ token, user })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    setSession({ token: null, user: null })
  }, [])

  useEffect(
    () =>
      onSessionExpired(() => {
        if (handlingExpiry.current) return
        handlingExpiry.current = true
        logout()
        toast.error(TOAST_MESSAGES.sessionExpired, { id: "session-expired" })
      }),
    [logout]
  )

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.token && session.user),
      displayName: getDisplayName(session.user),
      login,
      logout,
    }),
    [session, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
