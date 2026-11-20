import { clampScore, scoreColorClass } from "./scoreColor"

export default function ScoreBar({ score }) {
  const value = clampScore(score)
  return (
    <div className="flex flex-col gap-2">
      <span id="match-score-label" className="text-sm font-medium text-text-muted">
        Match score
      </span>
      <div className="flex items-center gap-4">
        <div
          role="progressbar"
          aria-labelledby="match-score-label"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${value}%`}
          className="h-3 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${scoreColorClass(value)}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="w-16 text-right text-2xl font-bold text-text">{value}%</span>
      </div>
    </div>
  )
}
