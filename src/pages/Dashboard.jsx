import DraftsBanner from "../components/dashboard/DraftsBanner"
import OverviewPanel from "../components/dashboard/OverviewPanel"
import { useAuth } from "../hooks/useAuth"
import { useDrafts } from "../hooks/useDrafts"
import { usePageTitle } from "../hooks/usePageTitle"
import { useResumesWithAnalyses } from "../hooks/useResumesWithAnalyses"

// /dashboard — Overview: stats, recent activity, quick actions.
export default function Dashboard() {
  usePageTitle("Overview")
  const { user } = useAuth()
  const { drafts, showBanner, dismissBanner } = useDrafts(user?.id)
  const { resumes, status, loadError, analysesById, analysesStatus, reload } =
    useResumesWithAnalyses()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold md:text-3xl">Overview</h1>

      {showBanner && <DraftsBanner count={drafts.length} onDismiss={dismissBanner} />}

      <OverviewPanel
        resumes={resumes}
        status={status}
        loadError={loadError}
        analysesById={analysesById}
        analysesStatus={analysesStatus}
        onRetry={reload}
      />
    </div>
  )
}
