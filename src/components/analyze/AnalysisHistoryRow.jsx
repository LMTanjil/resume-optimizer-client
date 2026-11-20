import { ChevronDown } from "lucide-react"
import { useId, useState } from "react"
import { formatRelativeDate } from "../../utils/dateUtils"
import AnalysisDetails from "./AnalysisDetails"
import { clampScore, scoreColorClass } from "./scoreColor"

export default function AnalysisHistoryRow({ analysis }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const score = clampScore(analysis.match_score)

  return (
    <li className="rounded-lg border border-border bg-surface">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-lg p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${scoreColorClass(score)}`}
          aria-hidden="true"
        />
        <span className="flex-1 text-sm text-text-muted">
          {formatRelativeDate(analysis.created_at)}
        </span>
        <span className="font-semibold">
          {score}%<span className="sr-only"> match score</span>
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`text-text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div id={panelId} hidden={!open} className="border-t border-border p-4">
        {open && <AnalysisDetails analysis={analysis} headingLevel={4} />}
      </div>
    </li>
  )
}
