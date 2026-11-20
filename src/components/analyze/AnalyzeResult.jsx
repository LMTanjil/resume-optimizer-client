import { Download } from "lucide-react"
import { forwardRef } from "react"
import { formatRelativeDate } from "../../utils/dateUtils"
import Button from "../ui/Button"
import AnalysisDetails from "./AnalysisDetails"
import ScoreBar from "./ScoreBar"

const AnalyzeResult = forwardRef(function AnalyzeResult(
  { analysis, onExport, exporting },
  headingRef
) {
  return (
    <section
      aria-labelledby="result-heading"
      className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="result-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold focus:outline-none"
        >
          Result
        </h2>
        {analysis && (
          <Button
            variant="secondary"
            icon={Download}
            onClick={onExport}
            loading={exporting}
            loadingText="Exporting…"
          >
            Export PDF
          </Button>
        )}
      </div>

      {analysis ? (
        <>
          <ScoreBar score={analysis.match_score} />
          <p className="-mt-3 text-sm text-text-muted">
            Analyzed {formatRelativeDate(analysis.created_at)}
          </p>
          <AnalysisDetails analysis={analysis} />
        </>
      ) : (
        <p className="text-text-muted">
          No analysis yet. Paste a job description above to get started.
        </p>
      )}
    </section>
  )
})

export default AnalyzeResult
