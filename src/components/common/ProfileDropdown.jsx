import { LogOut, Settings } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { TOAST_MESSAGES } from "../../constants"
import { useAuth } from "../../hooks/useAuth"
import { getAvatarColor, getAvatarInitial, getDisplayName } from "../../utils/user"

const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"

const ITEM_CLASSES =
  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"

/**
 * Navbar avatar + account menu.
 * Open: focus goes to the first item and Tab / Shift+Tab / arrows / Home / End stay inside.
 * Esc or choosing an item closes it and returns focus to the avatar. A click outside also
 * closes it, but leaves focus alone if the click landed on something focusable.
 */
export default function ProfileDropdown() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const menuId = useId()

  const name = getDisplayName(user)
  const email = user?.email ?? ""
  const color = getAvatarColor(email)

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const items = () => Array.from(menuRef.current?.querySelectorAll("[role='menuitem']") ?? [])
    items()[0]?.focus()

    const onMouseDown = (event) => {
      if (containerRef.current?.contains(event.target)) return
      close(!event.target.closest?.(FOCUSABLE))
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
        return
      }
      const list = items()
      if (list.length === 0) return
      const index = list.indexOf(document.activeElement)
      const move = (to) => {
        event.preventDefault()
        list[(to + list.length) % list.length].focus()
      }
      if (event.key === "Tab") move(index + (event.shiftKey ? -1 : 1))
      else if (event.key === "ArrowDown") move(index + 1)
      else if (event.key === "ArrowUp") move(index - 1)
      else if (event.key === "Home") move(0)
      else if (event.key === "End") move(list.length - 1)
    }

    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  const onSettings = () => {
    close()
    toast(TOAST_MESSAGES.comingSoon, { id: "coming-soon" })
  }

  // /logout goes through the unsaved-changes blocker, same as before.
  const onLogout = () => {
    close()
    navigate("/logout")
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Account menu for ${name || email}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
        style={{ backgroundColor: color.bg, color: color.text }}
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <span aria-hidden="true">{getAvatarInitial(user)}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-surface p-1 shadow-lg motion-safe:animate-fade-in">
          <div className="px-3 py-2">
            <p className="truncate font-semibold" title={name}>
              {name}
            </p>
            <p className="truncate text-sm text-text-muted" title={email}>
              {email}
            </p>
          </div>
          <div className="my-1 h-px bg-border" aria-hidden="true" />
          <div ref={menuRef} id={menuId} role="menu" aria-label="Account">
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={onSettings}
              className={`${ITEM_CLASSES} text-text hover:bg-muted`}
            >
              <Settings size={18} aria-hidden="true" />
              Settings
            </button>
            <div role="separator" className="my-1 h-px bg-border" />
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={onLogout}
              className={`${ITEM_CLASSES} text-warning hover:bg-warning-tint`}
            >
              <LogOut size={18} aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
