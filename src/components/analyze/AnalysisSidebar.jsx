import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { formatRelativeDate } from "../../utils/dateUtils"
import Button from "../ui/Button"
import AnalysisDetails from "./AnalysisDetails"
import ScoreBar from "./ScoreBar"

const CARD = "flex flex-col gap-6 rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6"

// Latest analysis next to the resume preview. analysis: the newest Analysis, or null.
export default function AnalysisSidebar({ analysis, resumeId }) {
  const analyzePath = `/resume/${resumeId}/analyze`

  if (!analysis) {
    return (
      <section aria-labelledby="analysis-heading" className={`${CARD} items-start`}>
        <div>
          <h2 id="analysis-heading" className="text-lg font-semibold">
            No analysis yet
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Compare this resume against a job description to see its match score, missing keywords
            and suggestions here.
          </p>
        </div>
        <Button variant="primary" icon={Sparkles} to={analyzePath}>
          Analyze this resume
        </Button>
      </section>
    )
  }

  const analyzedAt = formatRelativeDate(analysis.created_at)

  return (
    <section aria-labelledby="analysis-heading" className={CARD}>
      <div>
        <h2 id="analysis-heading" className="text-lg font-semibold">
          Latest Analysis
        </h2>
        {analyzedAt && <p className="mt-0.5 text-sm text-text-muted">Analyzed {analyzedAt}</p>}
      </div>
      <ScoreBar score={analysis.match_score} />
      <AnalysisDetails analysis={analysis} />
      <Link
        to={analyzePath}
        className="inline-flex items-center gap-1.5 self-start rounded-lg text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Run new analysis
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  )
}
