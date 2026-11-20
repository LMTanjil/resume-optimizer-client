import { FileClock, X } from "lucide-react"
import Button from "../ui/Button"

export default function DraftsBanner({ count, onDismiss }) {
  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted p-4"
    >
      <FileClock size={20} className="shrink-0 text-text" aria-hidden="true" />
      <p className="min-w-0 flex-1 font-medium">
        You have {count} unsaved {count === 1 ? "draft" : "drafts"}.
      </p>
      <Button variant="secondary" to="/dashboard/drafts">
        View drafts
      </Button>
      <Button variant="ghost" iconOnly icon={X} onClick={onDismiss} aria-label="Dismiss" />
    </div>
  )
}
