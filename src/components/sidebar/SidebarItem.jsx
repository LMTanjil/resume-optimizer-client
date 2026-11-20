import { Link, NavLink } from "react-router-dom"

const BASE =
  "flex h-10 items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm font-medium " +
  "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent"
// Dark mode: primary red text on navy is ~3:1 (fails WCAG AA), so the active label uses the
// normal text color there. The red tint and the primary-colored icon still mark it as active.
const ACTIVE = "bg-primary/10 text-primary dark:text-text"
const IDLE = "text-text-muted hover:bg-muted hover:text-text"

/**
 * One sidebar link. NavLink detects the active route. `isActive` overrides that for links
 * that should also be active on related routes (e.g. Analyze on /resume/:id/analyze).
 * When collapsed (md and up only), the label stays available to screen readers and as a tooltip.
 */
export default function SidebarItem({
  icon: Icon,
  label,
  path,
  collapsed = false,
  isActive,
  onClick,
}) {
  const classes = (active) =>
    `${BASE} ${collapsed ? "md:justify-center md:px-0" : ""} ${active ? ACTIVE : IDLE}`

  const content = (active) => (
    <>
      <Icon size={20} aria-hidden="true" className={`shrink-0 ${active ? "text-primary" : ""}`} />
      <span className={collapsed ? "md:sr-only" : "truncate"}>{label}</span>
    </>
  )

  const shared = { to: path, onClick, title: collapsed ? label : undefined }

  if (isActive !== undefined) {
    return (
      <Link {...shared} aria-current={isActive ? "page" : undefined} className={classes(isActive)}>
        {content(isActive)}
      </Link>
    )
  }

  return (
    <NavLink {...shared} end className={({ isActive: routeActive }) => classes(routeActive)}>
      {({ isActive: routeActive }) => content(routeActive)}
    </NavLink>
  )
}
