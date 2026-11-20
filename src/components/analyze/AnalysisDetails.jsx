import SuggestionsList from "./SuggestionsList"
import TagGroup from "./TagGroup"

// Keywords, strengths and suggestions — shared by the current result and history rows.
export default function AnalysisDetails({ analysis, headingLevel = 3 }) {
  return (
    <div className="flex flex-col gap-6">
      <TagGroup
        title="Missing keywords"
        tags={analysis.missing_keywords}
        variant="warning"
        emptyText="None. Great coverage!"
        headingLevel={headingLevel}
      />
      <TagGroup
        title="Strengths"
        tags={analysis.strengths}
        variant="success"
        emptyText="None identified."
        headingLevel={headingLevel}
      />
      <SuggestionsList suggestions={analysis.suggestions} headingLevel={headingLevel} />
    </div>
  )
}
