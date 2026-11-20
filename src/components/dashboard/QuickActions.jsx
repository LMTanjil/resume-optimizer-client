import { FilePlus, Upload } from "lucide-react"
import { Link } from "react-router-dom"

// Import Resume links to the builder for now; the import button is on its Contact step.
const ACTIONS = [
  {
    icon: FilePlus,
    title: "Create Resume",
    body: "Start from scratch with the step-by-step builder.",
    to: "/resume/new",
  },
  {
    icon: Upload,
    title: "Import Resume",
    body: "Upload a PDF, DOCX or Markdown file and review what we extract.",
    to: "/resume/new",
  },
]

export default function QuickActions() {
  return (
    <section aria-labelledby="quick-heading" className="flex flex-col gap-3">
      <h2 id="quick-heading" className="text-lg font-semibold">
        Quick actions
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {ACTIONS.map(({ icon: Icon, title, body, to }) => (
          <li key={title}>
            <Link
              to={to}
              className="flex h-full items-start gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm transition-shadow duration-150 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={24} aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-semibold">{title}</span>
                <span className="text-sm text-text-muted">{body}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
