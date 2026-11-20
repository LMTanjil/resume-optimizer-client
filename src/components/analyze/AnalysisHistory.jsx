import AnalysisHistoryRow from "./AnalysisHistoryRow"

export default function AnalysisHistory({ analyses }) {
  return (
    <section aria-labelledby="history-heading" className="flex flex-col gap-3">
      <h2 id="history-heading" className="text-xl font-semibold">
        Previous analyses
      </h2>
      {analyses.length === 0 ? (
        <p className="text-text-muted">No previous analyses.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {analyses.map((analysis) => (
            <AnalysisHistoryRow key={analysis.id} analysis={analysis} />
          ))}
        </ul>
      )}
    </section>
  )
}
