import { BarChart2, Pencil } from "lucide-react"
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import AnalysisSidebar from "../components/analyze/AnalysisSidebar"
import BackLink from "../components/common/BackLink"
import ErrorPanel from "../components/common/ErrorPanel"
import TemplatePicker from "../components/preview/TemplatePicker"
import {
  DEFAULT_TEMPLATE_ID,
  PDF_TEMPLATES,
  findTemplate,
} from "../components/resume/pdf/templates"
import Button from "../components/ui/Button"
import Skeleton from "../components/ui/Skeleton"
import { TOAST_MESSAGES } from "../constants"
import { usePageTitle } from "../hooks/usePageTitle"
import { getAnalyses, getResume } from "../services/api"
import { getErrorMessage, isNotFound } from "../utils/apiError"

// @react-pdf/renderer is large and browser-only, so it loads with this chunk, after the page shell.
const PdfPreview = lazy(() => import("../components/preview/PdfPreview"))

const byCreatedDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at)

function ViewerSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading preview">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-[70vh] min-h-[480px] w-full lg:h-[calc(100vh-16rem)] lg:min-h-[560px]" />
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6"
      aria-busy="true"
      aria-label="Loading analysis"
    >
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-full" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-4 lg:col-span-3">
        <div className="grid grid-cols-3 gap-3">
          {PDF_TEMPLATES.map((t) => (
            <Skeleton key={t.id} className="h-16" />
          ))}
        </div>
        <ViewerSkeleton />
      </div>
      <div className="lg:col-span-2">
        <SidebarSkeleton />
      </div>
    </div>
  )
}

// /resume/:id/preview: the resume rendered as a PDF in a chosen template, next to its latest analysis.
export default function ResumePreview() {
  usePageTitle("Preview")
  const { id } = useParams()

  const [resume, setResume] = useState(null)
  const [resumeStatus, setResumeStatus] = useState("loading") // loading | ready | error
  const [resumeError, setResumeError] = useState({ message: "", notFound: false })
  const [analyses, setAnalyses] = useState([])
  const [analysesStatus, setAnalysesStatus] = useState("loading")
  const [analysesError, setAnalysesError] = useState("")
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID)

  const loadResume = useCallback(
    async (isActive = () => true) => {
      setResumeStatus("loading")
      try {
        const { data } = await getResume(id)
        if (!isActive()) return
        setResume(data)
        setResumeStatus("ready")
      } catch (error) {
        if (!isActive()) return
        const notFound = isNotFound(error)
        setResumeError({
          message: notFound ? TOAST_MESSAGES.resumeNotFound : getErrorMessage(error),
          notFound,
        })
        setResumeStatus("error")
      }
    },
    [id]
  )

  const loadAnalyses = useCallback(
    async (isActive = () => true) => {
      setAnalysesStatus("loading")
      try {
        const { data } = await getAnalyses(id)
        if (!isActive()) return
        setAnalyses(Array.isArray(data) ? data : [])
        setAnalysesStatus("ready")
      } catch (error) {
        if (!isActive()) return
        setAnalysesError(getErrorMessage(error))
        setAnalysesStatus("error")
      }
    },
    [id]
  )

  useEffect(() => {
    let active = true
    const isActive = () => active
    loadResume(isActive)
    loadAnalyses(isActive)
    return () => {
      active = false
    }
  }, [loadResume, loadAnalyses])

  const latest = useMemo(() => [...analyses].sort(byCreatedDesc)[0] ?? null, [analyses])
  const template = findTemplate(templateId)
  const title = resume?.title || "Untitled resume"

  let body
  if (resumeStatus === "loading") {
    body = <PageSkeleton />
  } else if (resumeStatus === "error") {
    body = (
      <ErrorPanel
        message={resumeError.message}
        onRetry={resumeError.notFound ? undefined : () => loadResume()}
      />
    )
  } else {
    let sidebar
    if (analysesStatus === "loading") sidebar = <SidebarSkeleton />
    else if (analysesStatus === "error")
      sidebar = <ErrorPanel message={analysesError} onRetry={() => loadAnalyses()} />
    else sidebar = <AnalysisSidebar analysis={latest} resumeId={id} />

    body = (
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        {/* Left (60%): template picker, download, viewer. The viewer scrolls on its own. */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">
          <TemplatePicker templates={PDF_TEMPLATES} value={templateId} onChange={setTemplateId} />
          <Suspense fallback={<ViewerSkeleton />}>
            <PdfPreview template={template} content={resume?.content} title={title} />
          </Suspense>
        </div>

        {/* Right (40%): latest analysis. Sticky, and scrolls by itself when it's taller than
            the screen. Below lg it simply follows the preview. */}
        <aside
          aria-label="Analysis"
          className="min-w-0 lg:sticky lg:top-24 lg:col-span-2 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
        >
          {sidebar}
        </aside>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink to="/preview">Back to Preview</BackLink>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {resumeStatus === "loading" ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <h1 className="min-w-0 break-words text-2xl font-bold md:text-3xl">
            Preview{resume ? `: ${title}` : ""}
          </h1>
        )}
        {resumeStatus === "ready" && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={BarChart2} to={`/resume/${id}/analyze`}>
              Analyze
            </Button>
            <Button variant="secondary" icon={Pencil} to={`/resume/${id}/edit`}>
              Edit resume
            </Button>
          </div>
        )}
      </div>
      {body}
    </div>
  )
}
