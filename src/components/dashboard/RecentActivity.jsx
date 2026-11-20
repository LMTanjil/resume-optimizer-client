import { Sparkles } from "lucide-react"
import { formatRelativeDate } from "../../utils/dateUtils"
import Button from "../ui/Button"
import Skeleton from "../ui/Skeleton"

const RECENT_LIMIT = 5

// Last 5 resumes created (resumes arrive sorted newest first).
export default function RecentActivity({ resumes, loading }) {
  const recent = resumes.slice(0, RECENT_LIMIT)

  return (
    <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
      <h2 id="recent-heading" className="text-lg font-semibold">
        Recent activity
      </h2>

      <div className="rounded-lg border border-border bg-surface shadow-sm">
        {loading ? (
          <ul aria-busy="true" aria-label="Loading recent resumes">
            {Array.from({ length: 3 }, (_, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-4 border-b border-border p-4 last:border-b-0"
              >
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-28" />
              </li>
            ))}
          </ul>
        ) : recent.length === 0 ? (
          <p className="p-4 text-text-muted">No resumes yet. Create one to see it here.</p>
        ) : (
          <ul>
            {recent.map((resume) => {
              const title = resume.title || "Untitled resume"
              return (
                <li
                  key={resume.id}
                  className="flex items-center justify-between gap-4 border-b border-border p-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium" title={title}>
                      {title}
                    </p>
                    <p className="text-sm text-text-muted">
                      Created {formatRelativeDate(resume.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    icon={Sparkles}
                    to={`/resume/${resume.id}/analyze`}
                    hideLabelBelowMd
                    aria-label={`Analyze ${title}`}
                  >
                    Analyze
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
