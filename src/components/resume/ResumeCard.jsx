import { Pencil, Sparkles, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { formatRelativeDate } from "../../utils/dateUtils"
import Button from "../ui/Button"

// Whole card is clickable via a stretched title link; action buttons sit above it.
export default function ResumeCard({ resume, onDelete }) {
  return (
    <article className="relative flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm transition-shadow duration-150 hover:shadow-md md:p-6">
      <div className="min-w-0">
        <h3 className="line-clamp-2 break-words text-lg font-semibold">
          <Link
            to={`/resume/${resume.id}/edit`}
            className="rounded after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
          >
            {resume.title || "Untitled resume"}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Created {formatRelativeDate(resume.created_at)}
        </p>
      </div>
      <div className="relative z-10 mt-auto flex flex-wrap gap-2">
        <Button variant="primary" icon={Sparkles} to={`/resume/${resume.id}/analyze`}>
          Analyze
        </Button>
        <Button variant="secondary" icon={Pencil} to={`/resume/${resume.id}/edit`}>
          Edit
        </Button>
        <Button
          variant="destructive"
          icon={Trash2}
          onClick={() => onDelete(resume)}
          className="ml-auto"
          aria-label={`Delete ${resume.title || "resume"}`}
        >
          Delete
        </Button>
      </div>
    </article>
  )
}
