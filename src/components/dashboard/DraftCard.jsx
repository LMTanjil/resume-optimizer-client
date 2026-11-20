import { RotateCcw, Trash2 } from "lucide-react"
import { formatRelativeDate } from "../../utils/dateUtils"
import Button from "../ui/Button"

export default function DraftCard({ draft, onRestore, onDiscard }) {
  const title = draft.title?.trim() || "Untitled resume"
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6">
      <div className="min-w-0">
        <h3 className="line-clamp-2 break-words text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-text-muted">Saved {formatRelativeDate(draft.savedAt)}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        <Button variant="primary" icon={RotateCcw} onClick={() => onRestore(draft)}>
          Restore
        </Button>
        <Button
          variant="destructive"
          icon={Trash2}
          onClick={() => onDiscard(draft)}
          className="ml-auto"
          aria-label={`Discard draft ${title}`}
        >
          Discard
        </Button>
      </div>
    </article>
  )
}
