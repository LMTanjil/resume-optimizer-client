import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import Button from "../ui/Button"

// Builder action bar — docs/functional-requirements.md FR-BLD-03.
export default function StepActions({
  mode,
  step,
  total,
  saving,
  busy = false,
  onCancel,
  onBack,
  onNext,
  onSave,
}) {
  const isFirst = step === 1
  const isLast = step === total
  const isEdit = mode === "edit"

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Button variant="ghost" onClick={onCancel} disabled={saving}>
        Cancel
      </Button>
      <div className="flex flex-wrap justify-end gap-3">
        {!isFirst && (
          <Button variant="secondary" icon={ArrowLeft} onClick={onBack} disabled={saving || busy}>
            Back
          </Button>
        )}
        {isEdit && !isLast && (
          <Button
            variant="secondary"
            icon={Save}
            onClick={onSave}
            loading={saving}
            loadingText="Saving…"
            disabled={busy}
          >
            Save Changes
          </Button>
        )}
        {isLast ? (
          <Button
            variant="primary"
            icon={Save}
            onClick={onSave}
            loading={saving}
            loadingText="Saving…"
            disabled={busy}
          >
            Save Resume
          </Button>
        ) : (
          <Button variant="primary" onClick={onNext} disabled={saving || busy}>
            Next
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}
