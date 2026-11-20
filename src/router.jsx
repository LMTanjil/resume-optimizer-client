import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import GuestRoute from "./components/common/GuestRoute"
import ProtectedRoute from "./components/common/ProtectedRoute"
import AppLayout from "./layouts/AppLayout"
import LandingLayout from "./layouts/LandingLayout"
import PublicLayout from "./layouts/PublicLayout"
import Logout from "./pages/Logout"

// Data router so useBlocker works (docs/component-tree.md §2).
const Landing = lazy(() => import("./pages/Landing"))
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"))
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const MyResumes = lazy(() => import("./pages/MyResumes"))
const Drafts = lazy(() => import("./pages/Drafts"))
const ResumeNew = lazy(() => import("./pages/ResumeNew"))
const ResumeEdit = lazy(() => import("./pages/ResumeEdit"))
const Analyze = lazy(() => import("./pages/Analyze"))
const AnalyzePicker = lazy(() => import("./pages/AnalyzePicker"))
const PreviewPicker = lazy(() => import("./pages/PreviewPicker"))
const ResumePreview = lazy(() => import("./pages/ResumePreview"))
const NotFound = lazy(() => import("./pages/NotFound"))

export const router = createBrowserRouter([
  // Public marketing site: full width, no auth required.
  {
    element: <LandingLayout />,
    children: [{ path: "/", element: <Landing /> }],
  },
  // Minimal navbar (logo + theme toggle).
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
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-and-conditions", element: <TermsAndConditions /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  // App: sidebar layout behind auth.
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/logout", element: <Logout /> },
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/resumes", element: <MyResumes /> },
          { path: "/dashboard/drafts", element: <Drafts /> },
          { path: "/resume/new", element: <ResumeNew /> },
          { path: "/resume/:id/edit", element: <ResumeEdit /> },
          { path: "/analyze", element: <AnalyzePicker /> },
          { path: "/resume/:id/analyze", element: <Analyze /> },
          { path: "/preview", element: <PreviewPicker /> },
          { path: "/resume/:id/preview", element: <ResumePreview /> },
        ],
      },
    ],
  },
])
