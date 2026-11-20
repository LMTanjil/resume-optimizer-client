import { Sparkles } from "lucide-react"
import { LIMITS } from "../../constants"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import Textarea from "../ui/Textarea"

export default function AnalyzeForm({ value, onChange, onSubmit, loading, slow }) {
  const tooShort = value.trim().length < LIMITS.jobDescriptionMin

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (!tooShort && !loading) onSubmit()
      }}
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6"
    >
      <FormField
        id="job-description"
        label="Job description"
        required
        helper={tooShort ? `Minimum ${LIMITS.jobDescriptionMin} characters` : undefined}
      >
        {(field) => (
          <Textarea
            {...field}
            showCounter
            className="min-h-48"
            placeholder="Paste the job description here…"
            maxLength={LIMITS.jobDescription}
            value={value}
            disabled={loading}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </FormField>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="primary"
          icon={Sparkles}
          disabled={tooShort}
          loading={loading}
          loadingText="Analyzing…"
        >
          Analyze
        </Button>
        {loading && slow && (
          <p role="status" className="text-sm text-text-muted">
            This is taking longer than usual, please wait...
          </p>
        )}
      </div>
    </form>
  )
}
