import { summarizeAnalyses } from "../../utils/stats"
import ErrorPanel from "../common/ErrorPanel"
import OverviewStats from "./OverviewStats"
import QuickActions from "./QuickActions"
import RecentActivity from "./RecentActivity"

// Overview page content (/dashboard): stats row, recent activity, quick actions.
export default function OverviewPanel({
  resumes,
  status,
  loadError,
  analysesById,
  analysesStatus,
  onRetry,
}) {
  if (status === "error") return <ErrorPanel message={loadError} onRetry={onRetry} />

  const resumesLoading = status === "loading"
  const analysesLoading = resumesLoading || analysesStatus === "loading"
  const { totalAnalyses, averageScore, incomplete } = summarizeAnalyses(resumes, analysesById)

  return (
    <div className="flex flex-col gap-8">
      <OverviewStats
        totalResumes={resumes.length}
        totalAnalyses={totalAnalyses}
        averageScore={averageScore}
        resumesLoading={resumesLoading}
        analysesLoading={analysesLoading}
        incomplete={incomplete}
      />
      <RecentActivity resumes={resumes} loading={resumesLoading} />
      <QuickActions />
    </div>
  )
}
