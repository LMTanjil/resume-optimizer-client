import { Sparkles } from "lucide-react"
import { formatRelativeDate } from "../../utils/dateUtils"
import { lastAnalyzedAt } from "../../utils/stats"
import Button from "../ui/Button"
import Skeleton from "../ui/Skeleton"

// analyses: Analysis[] (loaded) · null (failed to load) · undefined (still loading)
function LastAnalyzed({ analyses }) {
  if (analyses === undefined) return <Skeleton className="h-4 w-32" />
  if (analyses === null) return <span>Last analyzed: unavailable</span>
  const last = lastAnalyzedAt(analyses)
  return <span>{last ? `Last analyzed ${formatRelativeDate(last)}` : "Never analyzed"}</span>
}

// The Analyze button's link is stretched over the card, so the whole card is clickable with a
// single tab stop.
export default function ResumePickerCard({ resume, analyses }) {
  const title = resume.title || "Untitled resume"

  return (
    <article className="relative flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm transition-shadow duration-150 hover:shadow-md md:p-6">
      <div className="min-w-0">
        <h2 className="line-clamp-2 break-words text-lg font-semibold">{title}</h2>
        <div className="mt-1 flex flex-col gap-1 text-sm text-text-muted">
          <span>Created {formatRelativeDate(resume.created_at)}</span>
          <LastAnalyzed analyses={analyses} />
        </div>
      </div>
      <Button
        variant="primary"
        icon={Sparkles}
        to={`/resume/${resume.id}/analyze`}
        aria-label={`Analyze ${title}`}
        className="mt-auto self-start after:absolute after:inset-0 after:rounded-lg after:content-['']"
      >
        Analyze
      </Button>
    </article>
  )
}
