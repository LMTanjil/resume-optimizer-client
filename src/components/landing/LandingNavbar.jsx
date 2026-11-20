import { Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { APP_NAME } from "../../constants"
import { useAuth } from "../../hooks/useAuth"
import ThemeToggle from "../common/ThemeToggle"
import Button from "../ui/Button"

const LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
]

const MENU_ID = "landing-menu"

const LINK_CLASSES =
  "rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-muted " +
  "hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"

// Landing page navbar: logo, section anchors, Login / Get Started. Links collapse below md.
export default function LandingNavbar() {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const close = () => setOpen(false)

  // Logged-in visitors get a way back into the app instead of Login / Get Started.
  const actions = (fullWidth) =>
    isAuthenticated ? (
      <Button to="/dashboard" variant="primary" className={fullWidth ? "w-full" : ""}>
        Go to dashboard
      </Button>
    ) : (
      <>
        <Button to="/login" variant="secondary" className={fullWidth ? "w-full" : ""}>
          Login
        </Button>
        <Button to="/register" variant="primary" className={fullWidth ? "w-full" : ""}>
          Get Started
        </Button>
      </>
    )

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 md:px-6 lg:px-8"
      >
        <Link
          to="/"
          className="rounded-lg text-xl font-bold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {APP_NAME}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={LINK_CLASSES}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          <div className="hidden items-center gap-3 md:flex">{actions(false)}</div>
          <Button
            ref={toggleRef}
            variant="ghost"
            iconOnly
            icon={open ? X : Menu}
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls={MENU_ID}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          />
        </div>
      </nav>

      {open && (
        <div
          id={MENU_ID}
          className="border-t border-border bg-surface px-4 pb-4 pt-2 motion-safe:animate-fade-in md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close} className={`block ${LINK_CLASSES}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
            {actions(true)}
          </div>
        </div>
      )}
    </header>
  )
}
