import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

// /login and /register: logged-in users go to the dashboard.
export default function GuestRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
