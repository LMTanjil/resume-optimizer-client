import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  FileText,
  LayoutDashboard,
  X,
} from "lucide-react"
import { Link, matchPath, useLocation } from "react-router-dom"
import { APP_NAME, NEW_RESUME_EVENT, SIDEBAR_ID } from "../../constants"
import Button from "../ui/Button"
import SidebarItem from "./SidebarItem"

/**
 * App navigation (docs/component-tree.md).
 * md and up: sticky column, 240px expanded / 64px collapsed.
 * Below md: off-canvas drawer opened from the navbar hamburger.
 */
export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  closeButtonRef,
}) {
  const { pathname, search } = useLocation()
  const onDashboard = pathname === "/dashboard"
  const draftsTab = onDashboard && new URLSearchParams(search).get("tab") === "drafts"

  const items = [
    {
      key: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      isActive: onDashboard && !draftsTab,
    },
    {
      key: "create",
      icon: FilePlus,
      label: "Create Resume",
      path: "/resume/new",
      // Already on the builder: let it decide (discard modal or no-op) — FR-BLD-13.
      onClick: (event) => {
        if (pathname !== "/resume/new") return
        event.preventDefault()
        window.dispatchEvent(new Event(NEW_RESUME_EVENT))
      },
    },
    {
      key: "analyze",
      icon: BarChart2,
      label: "Analyze Resume",
      path: "/analyze",
      // Also active on a specific resume's analyze page.
      isActive: pathname === "/analyze" || Boolean(matchPath("/resume/:id/analyze", pathname)),
    },
    {
      key: "drafts",
      icon: FileText,
      label: "Drafts",
      path: "/dashboard?tab=drafts",
      isActive: draftsTab,
    },
  ]

  const width = collapsed ? "md:w-16" : "md:w-60"
  const drawer = mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full"

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 motion-safe:animate-fade-in md:hidden"
          aria-hidden="true"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id={SIDEBAR_ID}
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col overflow-hidden border-r border-border bg-surface transition-[width,transform,visibility] duration-200 ease-out [grid-area:sidebar] md:visible md:sticky md:bottom-auto md:top-0 md:z-30 md:h-screen md:translate-x-0 ${width} ${drawer}`}
      >
        {/* Drawer header (mobile only) */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 md:hidden">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="rounded-lg text-xl font-bold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {APP_NAME}
          </Link>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            iconOnly
            icon={X}
            aria-label="Close navigation"
            onClick={onCloseMobile}
          />
        </div>

        <nav aria-label="App" className="flex-1 overflow-y-auto overflow-x-hidden p-2">
          <ul className="flex flex-col gap-1">
            {items.map(({ key, onClick, ...item }) => (
              <li key={key}>
                <SidebarItem
                  {...item}
                  collapsed={collapsed}
                  onClick={(event) => {
                    onClick?.(event)
                    onCloseMobile()
                  }}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse toggle (md and up) */}
        <div className="hidden shrink-0 border-t border-border p-2 md:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-controls={SIDEBAR_ID}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : undefined}
            className={`flex h-10 w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-text-muted transition-colors hover:bg-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${collapsed ? "justify-center px-0" : ""}`}
          >
            {collapsed ? (
              <ChevronRight size={20} aria-hidden="true" className="shrink-0" />
            ) : (
              <>
                <ChevronLeft size={20} aria-hidden="true" className="shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
