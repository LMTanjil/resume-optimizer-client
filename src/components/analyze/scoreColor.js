// < 50 warning red · 50–75 amber · > 75 green (docs/design.md §5.5).
export function scoreColorClass(score) {
  if (score > 75) return "bg-success"
  if (score >= 50) return "bg-amber"
  return "bg-warning"
}

export function clampScore(score) {
  const value = Number(score)
  return Number.isFinite(value) ? Math.min(Math.max(Math.round(value), 0), 100) : 0
}
