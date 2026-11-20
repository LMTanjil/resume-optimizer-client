import { Upload } from "lucide-react"
import { useRef } from "react"
import { IMPORT_EXTENSIONS, IMPORT_MAX_MB } from "../../constants"
import Button from "../ui/Button"

const LOADING_TEXT = "Extracting resume data…"

// "Import existing resume" on the Contact step — docs/functional-requirements.md FR-BLD-14.
// Only picks the file; ResumeStepForm validates, uploads and fills the form.
export default function ImportResumeButton({ importing, onFile }) {
  const inputRef = useRef(null)

  const onChange = (event) => {
    const file = event.target.files?.[0]
    // Clear the value so choosing the same file again still fires onChange.
    event.target.value = ""
    if (file) onFile(file)
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
      <Button
        variant="secondary"
        icon={Upload}
        loading={importing}
        loadingText={LOADING_TEXT}
        aria-describedby="import-hint"
        onClick={() => inputRef.current?.click()}
      >
        Import existing resume
      </Button>
      <p id="import-hint" className="text-sm text-text-muted">
        PDF, DOCX or Markdown, up to {IMPORT_MAX_MB} MB. Details found in the file replace what's
        filled in.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={IMPORT_EXTENSIONS.join(",")}
        hidden
        tabIndex={-1}
        onChange={onChange}
      />
      <span className="sr-only" role="status" aria-live="polite">
        {importing ? LOADING_TEXT : ""}
      </span>
    </div>
  )
}
