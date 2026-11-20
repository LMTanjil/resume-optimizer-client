import { Trash2 } from "lucide-react"
import Button from "../ui/Button"

export default function ArrayEntryCard({ title, onRemove, children }) {
  return (
    <fieldset className="rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <legend className="float-left text-lg font-semibold">{title}</legend>
        <Button
          variant="ghost"
          iconOnly
          icon={Trash2}
          onClick={onRemove}
          aria-label={`Remove ${title.toLowerCase()}`}
        />
      </div>
      <div className="clear-both flex flex-col gap-4">{children}</div>
    </fieldset>
  )
}
