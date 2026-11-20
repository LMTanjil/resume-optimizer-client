import { BarChart2, FileText, Gauge } from "lucide-react"
import StatCard from "./StatCard"

export default function OverviewStats({
  totalResumes,
  totalAnalyses,
  averageScore,
  resumesLoading,
  analysesLoading,
  incomplete,
}) {
  return (
    <section aria-labelledby="stats-heading" aria-busy={resumesLoading || analysesLoading}>
      <h2 id="stats-heading" className="sr-only">
        Stats
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        <StatCard
          icon={FileText}
          label="Total Resumes"
          value={totalResumes}
          loading={resumesLoading}
        />
        <StatCard
          icon={BarChart2}
          label="Total Analyses Run"
          value={totalAnalyses}
          loading={analysesLoading}
        />
        <StatCard
          icon={Gauge}
          label="Average Match Score"
          value={averageScore === null ? "N/A" : `${averageScore}%`}
          loading={analysesLoading}
        />
      </div>
      {incomplete && !analysesLoading && (
        <p className="mt-3 text-sm text-text-muted" role="status">
          Some analyses couldn&apos;t be loaded, so these numbers may be incomplete.
        </p>
      )}
    </section>
  )
}
