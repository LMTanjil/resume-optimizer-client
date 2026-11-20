// A tiny schematic of each template's layout (decorative).
function Thumbnail({ id }) {
  if (id === "modern") {
    return (
      <div className="flex h-12 w-10 overflow-hidden rounded-sm border border-border bg-white">
        <div className="flex w-[35%] flex-col gap-1 bg-[#1A1F2E] p-1">
          <div className="h-1 rounded-full bg-white/80" />
          <div className="h-0.5 rounded-full bg-white/40" />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-1">
          <div className="h-0.5 w-2/3 rounded-full bg-[#D50032]" />
          <div className="h-0.5 rounded-full bg-gray-300" />
          <div className="h-0.5 rounded-full bg-gray-300" />
        </div>
      </div>
    )
  }
  if (id === "minimal") {
    return (
      <div className="flex h-12 w-10 flex-col items-center gap-1 rounded-sm border border-border bg-white p-1.5">
        <div className="h-0.5 w-2/3 rounded-full bg-gray-500" />
        <div className="h-0.5 w-1/2 rounded-full bg-gray-300" />
        <div className="mt-1 h-0.5 w-full rounded-full bg-gray-300" />
        <div className="h-0.5 w-full rounded-full bg-gray-300" />
      </div>
    )
  }
  return (
    <div className="flex h-12 w-10 flex-col gap-1 rounded-sm border border-border bg-white p-1.5">
      <div className="h-1 w-2/3 rounded-full bg-gray-800" />
      <div className="h-px w-full bg-gray-800" />
      <div className="h-0.5 w-full rounded-full bg-gray-300" />
      <div className="h-0.5 w-full rounded-full bg-gray-300" />
    </div>
  )
}

// Template choice as a radio group styled as cards. The selected card gets a primary border.
export default function TemplatePicker({ templates, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-text-muted">Template</legend>
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => {
          const selected = template.id === value
          return (
            <label
              key={template.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 bg-surface p-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg sm:p-3 ${
                selected ? "border-primary" : "border-border hover:border-text-muted"
              }`}
            >
              <input
                type="radio"
                name="pdf-template"
                value={template.id}
                checked={selected}
                onChange={() => onChange(template.id)}
                className="sr-only"
              />
              <span aria-hidden="true" className="hidden shrink-0 sm:block">
                <Thumbnail id={template.id} />
              </span>
              <span className="min-w-0 truncate text-sm font-medium">{template.name}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
