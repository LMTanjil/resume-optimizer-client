export default function SuggestionsList({ suggestions, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  const list = Array.isArray(suggestions) ? suggestions : []
  return (
    <div className="flex flex-col gap-2">
      <Heading className="text-base font-semibold">Suggestions</Heading>
      {list.length === 0 ? (
        <p className="text-sm text-text-muted">No suggestions.</p>
      ) : (
        <ol className="flex list-decimal flex-col gap-2 pl-5 leading-relaxed marker:text-text-muted">
          {list.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ol>
      )}
    </div>
  )
}
