import { Suspense, useEffect, useRef, useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/common/Navbar"
import SkipLink from "../components/common/SkipLink"
import Sidebar from "../components/sidebar/Sidebar"
import Spinner from "../components/ui/Spinner"
import { STORAGE_KEYS } from "../constants"

// Sidebar | navbar / content grid for every authenticated page (replaces AuthLayout).
const GRID = {
  gridTemplateAreas: '"sidebar navbar" "sidebar content"',
  gridTemplateColumns: "auto 1fr",
  gridTemplateRows: "auto 1fr",
}

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "true"
  } catch {
    return false
  }
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const wasOpen = useRef(false)

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(next))
    } catch {
      /* storage unavailable — the preference just won't persist */
    }
  }

  // Mobile drawer: focus into it on open, Esc closes, page scroll locked, focus back on close.
  useEffect(() => {
    if (!mobileOpen) {
      if (wasOpen.current) menuButtonRef.current?.focus()
      wasOpen.current = false
      return undefined
    }
    wasOpen.current = true
    closeButtonRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  // While the drawer is open, the rest of the page is inert (not focusable or clickable).
  const inert = mobileOpen ? "" : undefined

  return (
    <div className="grid min-h-screen" style={GRID}>
      <SkipLink />
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        closeButtonRef={closeButtonRef}
      />
      <div className="sticky top-0 z-40 min-w-0 [grid-area:navbar]" inert={inert}>
        <Navbar
          variant="authenticated"
          menuOpen={mobileOpen}
          onOpenMenu={() => setMobileOpen(true)}
          menuButtonRef={menuButtonRef}
        />
      </div>
      <main
        id="main"
        tabIndex={-1}
        inert={inert}
        className="min-w-0 px-4 py-6 [grid-area:content] focus:outline-none md:px-6 md:py-8 lg:px-8"
      >
        <div className="mx-auto w-full max-w-content">
          <Suspense fallback={<Spinner page />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
