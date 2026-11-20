import ErrorPanel from "../components/common/ErrorPanel"
import EmptyState from "../components/dashboard/EmptyState"
import { GRID_CLASSES } from "../components/dashboard/ResumeGrid"
import PreviewPickerCard from "../components/preview/PreviewPickerCard"
import Skeleton from "../components/ui/Skeleton"
import { usePageTitle } from "../hooks/usePageTitle"
import { useResumesWithAnalyses } from "../hooks/useResumesWithAnalyses"

function PickerSkeleton() {
  return (
    <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading resumes">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 md:p-6"
        >
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="mt-2 h-10 w-28" />
        </div>
      ))}
    </div>
  )
}

// /preview: pick which resume to preview (the sidebar's Preview item).
export default function PreviewPicker() {
  usePageTitle("Preview")
  // Cards only show title and created date, so the per-resume analyses aren't needed.
  const { resumes, status, loadError, reload } = useResumesWithAnalyses({ withAnalyses: false })

  let content
  if (status === "loading") content = <PickerSkeleton />
  else if (status === "error") content = <ErrorPanel message={loadError} onRetry={reload} />
  else if (resumes.length === 0)
    content = (
      <EmptyState
        message="You have no resumes yet."
        actionLabel="Create Resume"
        actionTo="/resume/new"
      />
    )
  else
    content = (
      <div className={GRID_CLASSES}>
        {resumes.map((resume) => (
          <PreviewPickerCard key={resume.id} resume={resume} />
        ))}
      </div>
    )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Select a resume to preview</h1>
        <p className="mt-1 text-text-muted">
          See it as a PDF in the Classic, Modern or Minimal template, and download it.
        </p>
      </div>
      {content}
    </div>
  )
}
