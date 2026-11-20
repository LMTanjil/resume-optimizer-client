import { X } from "lucide-react"

const VARIANTS = {
  neutral: "bg-muted text-text",
  warning: "bg-warning-tint text-warning",
  success: "bg-success-tint text-success",
}

export default function Tag({ variant = "neutral", children, onRemove }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${VARIANTS[variant]}`}
    >
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${children}`}
          className="-mr-1 rounded-full p-0.5 transition-colors hover:bg-text/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </span>
  )
}
