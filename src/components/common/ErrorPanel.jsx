import { AlertCircle, RotateCw } from "lucide-react"
import Button from "../ui/Button"

export default function ErrorPanel({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-8 text-center shadow-sm"
    >
      <AlertCircle size={32} className="text-warning" aria-hidden="true" />
      <p className="text-text">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon={RotateCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
