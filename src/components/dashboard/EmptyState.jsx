import { FileText, Plus } from "lucide-react"
import Button from "../ui/Button"

export default function EmptyState({ message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
      <FileText size={36} className="text-text-muted" aria-hidden="true" />
      <p className="text-text-muted">{message}</p>
      {actionLabel && (
        <Button variant="primary" icon={Plus} to={actionTo}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
