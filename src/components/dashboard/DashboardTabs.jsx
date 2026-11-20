import { useRef } from "react"
import { DASHBOARD_TABS as TABS, panelId, tabId } from "./tabIds"

// WAI-ARIA tabs: arrow keys move between tabs, only the active tab is in the tab order.
export default function DashboardTabs({ activeTab, onChange, draftCount }) {
  const refs = useRef({})

  const onKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const index = TABS.findIndex((tab) => tab.key === activeTab)
    const delta = event.key === "ArrowRight" ? 1 : -1
    const next = TABS[(index + delta + TABS.length) % TABS.length]
    onChange(next.key)
    refs.current[next.key]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Dashboard sections"
      className="flex gap-6 border-b border-border"
    >
      {TABS.map((tab) => {
        const selected = tab.key === activeTab
        const label =
          tab.key === "drafts" && draftCount > 0 ? `${tab.label} (${draftCount})` : tab.label
        return (
          <button
            key={tab.key}
            ref={(el) => (refs.current[tab.key] = el)}
            id={tabId(tab.key)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId(tab.key)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={onKeyDown}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-1 pb-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              selected
                ? "border-primary font-semibold text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
