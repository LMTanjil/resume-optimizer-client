import { useEffect } from "react"
import toast from "react-hot-toast"
import { TOAST_MESSAGES } from "../constants"
import { useAuth } from "../hooks/useAuth"

// Internal route so Navbar Logout goes through the unsaved-changes blocker
// (docs/state-management.md §8). Clearing the session makes ProtectedRoute redirect to /login.
export default function Logout() {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
    toast.success(TOAST_MESSAGES.loggedOut, { id: "logged-out" })
  }, [logout])

  return null
}
