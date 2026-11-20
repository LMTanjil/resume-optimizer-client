import { Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { APP_NAME, SIDEBAR_ID } from "../../constants"
import Button from "../ui/Button"
import ProfileDropdown from "./ProfileDropdown"
import ThemeToggle from "./ThemeToggle"

const LOGO_CLASSES =
  "rounded-lg text-xl font-bold text-accent focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"

/**
 * variant "public": logo + theme toggle (login, register, legal pages, 404).
 * variant "authenticated": the AppLayout top bar — hamburger (mobile), logo, theme toggle,
 * profile avatar menu (name, email, Settings, Logout). Navigation lives in the Sidebar.
 */
export default function Navbar({
  variant = "public",
  menuOpen = false,
  onOpenMenu,
  menuButtonRef,
}) {
  const isAuthed = variant === "authenticated"

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-surface">
      <nav
        aria-label="Main"
        className={`flex h-full items-center justify-between gap-2 px-4 md:px-6 lg:px-8 ${isAuthed ? "" : "mx-auto max-w-content"}`}
      >
        <div className="flex items-center gap-2">
          {isAuthed && (
            <Button
              ref={menuButtonRef}
              variant="ghost"
              iconOnly
              icon={Menu}
              className="-ml-2 md:hidden"
              aria-label="Open navigation"
              aria-controls={SIDEBAR_ID}
              aria-expanded={menuOpen}
              onClick={onOpenMenu}
            />
          )}
          <Link to="/" className={LOGO_CLASSES}>
            {APP_NAME}
          </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          {isAuthed && <ProfileDropdown />}
        </div>
      </nav>
    </header>
  )
}
