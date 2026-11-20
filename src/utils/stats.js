import { clampScore } from "../components/analyze/scoreColor"

// analysesById: { [resumeId]: Analysis[] | null }. null means that resume's analyses failed to load.

// Totals across all resumes for the Overview stats row.
export function summarizeAnalyses(resumes, analysesById) {
  let totalAnalyses = 0
  let scoreSum = 0
  let scored = 0
  let incomplete = false

  resumes.forEach((resume) => {
    const list = analysesById[resume.id]
    if (!Array.isArray(list)) {
      incomplete = true
      return
    }
    totalAnalyses += list.length
    list.forEach((analysis) => {
      if (Number.isFinite(Number(analysis?.match_score))) {
        scoreSum += clampScore(analysis.match_score)
        scored += 1
      }
    })
  })

  return {
    totalAnalyses,
    averageScore: scored > 0 ? Math.round(scoreSum / scored) : null,
    incomplete,
  }
}

// Newest created_at in a list of analyses, or null when there are none.
export function lastAnalyzedAt(analyses) {
  if (!Array.isArray(analyses) || analyses.length === 0) return null
  return analyses.reduce((latest, analysis) => {
    const time = new Date(analysis?.created_at).getTime()
    return Number.isFinite(time) && (latest === null || time > new Date(latest).getTime())
      ? analysis.created_at
      : latest
  }, null)
}
