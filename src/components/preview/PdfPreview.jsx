import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import { AlertCircle, Download } from "lucide-react"
import { useMemo } from "react"
import { slugify } from "../../utils/resumeData"
import { TEMPLATE_COMPONENTS } from "../resume/pdf/templateComponents"
import Spinner from "../ui/Spinner"

// Same look as <Button variant="primary">; PDFDownloadLink renders its own <a>.
const DOWNLOAD_CLASSES =
  "inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-transparent " +
  "bg-primary px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-hover " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg [&:not([href])]:pointer-events-none [&:not([href])]:opacity-60"

function DownloadLabel({ loading, error }) {
  if (loading) {
    return (
      <>
        <Spinner size={16} />
        <span>Preparing PDF...</span>
      </>
    )
  }
  if (error) {
    return (
      <>
        <AlertCircle size={18} aria-hidden="true" />
        <span>Couldn&apos;t prepare the PDF</span>
      </>
    )
  }
  return (
    <>
      <Download size={18} aria-hidden="true" />
      <span>Download PDF</span>
    </>
  )
}

/**
 * Download button + live preview of the resume in the chosen template.
 * Loaded lazily by ResumePreview: @react-pdf/renderer is large and only works in the browser.
 */
export default function PdfPreview({ template, content, title }) {
  // One stable element per template/resume, so the viewer and the download link only re-render
  // the PDF when one of them actually changes.
  const document = useMemo(() => {
    const Template = TEMPLATE_COMPONENTS[template.id] ?? TEMPLATE_COMPONENTS.classic
    return <Template content={content} title={title} />
  }, [template.id, content, title])
  const fileName = `${slugify(title)}-${template.id}.pdf`

  if (typeof window === "undefined") return null

  return (
    <div className="flex flex-col gap-4">
      {/* The anchor has no href (so it isn't clickable or focusable) until the PDF is ready. */}
      <PDFDownloadLink document={document} fileName={fileName} className={DOWNLOAD_CLASSES}>
        {({ loading, error }) => (
          <span className="inline-flex items-center gap-2" aria-live="polite">
            <DownloadLabel loading={loading} error={error} />
          </span>
        )}
      </PDFDownloadLink>

      <div className="h-[70vh] min-h-[480px] overflow-hidden rounded-lg border border-border bg-muted lg:h-[calc(100vh-16rem)] lg:min-h-[560px]">
        <PDFViewer
          title={`${template.name} preview of ${title || "resume"}`}
          width="100%"
          height="100%"
          className="block border-0"
        >
          {document}
        </PDFViewer>
      </div>
    </div>
  )
}
