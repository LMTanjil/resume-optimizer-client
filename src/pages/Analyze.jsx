import { Pencil } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import AnalysisHistory from "../components/analyze/AnalysisHistory"
import AnalyzeForm from "../components/analyze/AnalyzeForm"
import AnalyzeResult from "../components/analyze/AnalyzeResult"
import BackLink from "../components/common/BackLink"
import ErrorPanel from "../components/common/ErrorPanel"
import Button from "../components/ui/Button"
import Skeleton from "../components/ui/Skeleton"
import { ANALYZE_SLOW_AFTER_MS, HISTORY_LIMIT, TOAST_MESSAGES } from "../constants"
import { usePageTitle } from "../hooks/usePageTitle"
import { analyzeResume, getAnalyses, getResume } from "../services/api"
import { getErrorMessage, isNotFound, shouldShowError } from "../utils/apiError"
import { exportPdf } from "../utils/exportPdf"

function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading analyses">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-44" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function Analyze() {
  usePageTitle("Analyze")
  const { id } = useParams()
  const navigate = useNavigate()
  const resultHeadingRef = useRef(null)

  const [resume, setResume] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [analysesStatus, setAnalysesStatus] = useState("loading") // loading | ready | error
  const [analysesError, setAnalysesError] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [slow, setSlow] = useState(false)
  const [exporting, setExporting] = useState(false)

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

    getResume(id)
      .then(({ data }) => {
        if (active) setResume(data)
      })
      .catch((error) => {
        if (!active || !shouldShowError(error)) return
        toast.error(isNotFound(error) ? TOAST_MESSAGES.resumeNotFound : getErrorMessage(error))
        navigate("/dashboard", { replace: true })
      })
    loadAnalyses(isActive)

    return () => {
      active = false
    }
  }, [id, navigate, loadAnalyses])

  // Show the "taking longer than usual" note after 10 s.
  useEffect(() => {
    if (!analyzing) {
      setSlow(false)
      return undefined
    }
    const timer = setTimeout(() => setSlow(true), ANALYZE_SLOW_AFTER_MS)
    return () => clearTimeout(timer)
  }, [analyzing])

  const runAnalysis = async () => {
    setAnalyzing(true)
    try {
      const { data } = await analyzeResume(Number(id) || id, jobDescription.trim())
      setAnalyses((list) => [data, ...list.filter((a) => a.id !== data.id)])
      setAnalysesStatus("ready")
      loadAnalyses()
      requestAnimationFrame(() => resultHeadingRef.current?.focus())
    } catch (error) {
      if (shouldShowError(error)) toast.error(getErrorMessage(error))
    } finally {
      setAnalyzing(false)
    }
  }

  const current = analyses[0] ?? null
  const history = analyses.slice(1, 1 + HISTORY_LIMIT)

  const handleExport = async () => {
    if (!current || !resume) return
    setExporting(true)
    try {
      await exportPdf(resume, current)
    } catch (error) {
      console.error(error)
      toast.error(TOAST_MESSAGES.pdfFailed)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <BackLink />
      <div className="flex flex-wrap items-center justify-between gap-3">
        {resume ? (
          <h1 className="min-w-0 break-words text-2xl font-bold md:text-3xl">
            Analyze: {resume.title || "Untitled resume"}
          </h1>
        ) : (
          <Skeleton className="h-9 w-64" />
        )}
        <Button variant="secondary" icon={Pencil} to={`/resume/${id}/edit`}>
          Edit resume
        </Button>
      </div>

      <AnalyzeForm
        value={jobDescription}
        onChange={setJobDescription}
        onSubmit={runAnalysis}
        loading={analyzing}
        slow={slow}
      />

      {analysesStatus === "loading" && analyses.length === 0 ? (
        <ResultsSkeleton />
      ) : analysesStatus === "error" && analyses.length === 0 ? (
        <ErrorPanel message={analysesError} onRetry={() => loadAnalyses()} />
      ) : (
        <>
          <AnalyzeResult
            ref={resultHeadingRef}
            analysis={current}
            onExport={handleExport}
            exporting={exporting}
          />
          <AnalysisHistory analyses={history} />
        </>
      )}
    </div>
  )
}
