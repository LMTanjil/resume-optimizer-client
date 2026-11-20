import { LogOut, Plus } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { APP_NAME, NEW_RESUME_EVENT } from "../../constants"
import { useAuth } from "../../hooks/useAuth"
import Button from "../ui/Button"
import ThemeToggle from "./ThemeToggle"

// variant: "authenticated" | "public" (docs/design.md §5.8)
export default function Navbar({ variant = "public" }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isAuthed = variant === "authenticated"

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-surface">
      <nav
        aria-label="Main"
        className="mx-auto flex h-full max-w-content items-center justify-between gap-2 px-4 md:px-6 lg:px-8"
      >
        <Link
          to="/"
          className="rounded-lg text-xl font-bold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          {isAuthed && (
            <>
              <span
                className="hidden max-w-[16rem] truncate text-sm text-text-muted md:inline"
                title={user?.email}
              >
                {user?.email}
              </span>
              <Button
                variant="secondary"
                icon={Plus}
                hideLabelBelowMd
                onClick={() => {
                  // Same route: let the builder decide (discard modal or no-op), FR-BLD-13.
                  if (pathname === "/resume/new") window.dispatchEvent(new Event(NEW_RESUME_EVENT))
                  else navigate("/resume/new")
                }}
              >
                New Resume
              </Button>
              <Button
                variant="ghost"
                icon={LogOut}
                hideLabelBelowMd
                onClick={() => navigate("/logout")}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
