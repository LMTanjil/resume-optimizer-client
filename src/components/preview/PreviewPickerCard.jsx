import { FileOutput } from "lucide-react"
import { formatRelativeDate } from "../../utils/dateUtils"
import Button from "../ui/Button"

// /preview card. The Preview link is stretched over the card, so the whole card is clickable with
// a single tab stop (same pattern as the Analyze picker).
export default function PreviewPickerCard({ resume }) {
  const title = resume.title || "Untitled resume"

  return (
    <article className="relative flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm transition-shadow duration-150 hover:shadow-md md:p-6">
      <div className="min-w-0">
        <h2 className="line-clamp-2 break-words text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-text-muted">
          Created {formatRelativeDate(resume.created_at)}
        </p>
      </div>
      <Button
        variant="primary"
        icon={FileOutput}
        to={`/resume/${resume.id}/preview`}
        aria-label={`Preview ${title}`}
        className="mt-auto self-start after:absolute after:inset-0 after:rounded-lg after:content-['']"
      >
        Preview
      </Button>
    </article>
  )
}
