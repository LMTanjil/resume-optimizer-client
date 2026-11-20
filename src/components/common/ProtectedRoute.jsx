import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

// Wraps every route that requires a session. No session → /login.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children ?? <Outlet />
}
