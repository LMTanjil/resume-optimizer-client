import ResumeCard from "../resume/ResumeCard"
import Skeleton from "../ui/Skeleton"
import EmptyState from "./EmptyState"

export const GRID_CLASSES = "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export default function ResumeGrid({ resumes, loading, onDelete }) {
  if (loading) {
    return (
      <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading resumes">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (resumes.length === 0) {
    return (
      <EmptyState
        message="You have no resumes yet. Start by creating one!"
        actionLabel="Create Resume"
        actionTo="/resume/new"
      />
    )
  }

  return (
    <div className={GRID_CLASSES}>
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} onDelete={onDelete} />
      ))}
    </div>
  )
}
