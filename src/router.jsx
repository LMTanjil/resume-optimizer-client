import { lazy } from "react"
import { Navigate, createBrowserRouter } from "react-router-dom"
import GuestRoute from "./components/common/GuestRoute"
import ProtectedRoute from "./components/common/ProtectedRoute"
import { useAuth } from "./hooks/useAuth"
import AuthLayout from "./layouts/AuthLayout"
import PublicLayout from "./layouts/PublicLayout"
import Logout from "./pages/Logout"

// Data router so useBlocker works (docs/component-tree.md §2).
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const ResumeNew = lazy(() => import("./pages/ResumeNew"))
const ResumeEdit = lazy(() => import("./pages/ResumeEdit"))
const Analyze = lazy(() => import("./pages/Analyze"))
const NotFound = lazy(() => import("./pages/NotFound"))

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
}

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    element: <PublicLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/logout", element: <Logout /> },
      {
        element: <AuthLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/resume/new", element: <ResumeNew /> },
          { path: "/resume/:id/edit", element: <ResumeEdit /> },
          { path: "/resume/:id/analyze", element: <Analyze /> },
        ],
      },
    ],
  },
])
