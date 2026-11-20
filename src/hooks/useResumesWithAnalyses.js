import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { getAnalyses, getResumes } from "../services/api"
import { getErrorMessage, shouldShowError } from "../utils/apiError"
import { mapWithConcurrency } from "../utils/async"

const ANALYSES_CONCURRENCY = 4
const byCreatedDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at)

/**
 * Loads the user's resumes (newest first), then each resume's analyses, at most 4 requests at a
 * time. Used by the Dashboard Overview and the Analyze picker.
 *
 * analysesById: { [resumeId]: Analysis[] | null }. null means that resume's request failed.
 * A missing key means it hasn't loaded yet.
 */
export function useResumesWithAnalyses() {
  const [resumes, setResumes] = useState([])
  const [status, setStatus] = useState("loading") // loading | ready | error
  const [loadError, setLoadError] = useState("")
  const [analysesById, setAnalysesById] = useState({})
  const [analysesStatus, setAnalysesStatus] = useState("loading") // loading | ready | error
  const runRef = useRef(0)

  const load = useCallback(async () => {
    const run = ++runRef.current
    const isCurrent = () => run === runRef.current
    setStatus("loading")
    setAnalysesStatus("loading")

    let list
    try {
      const { data } = await getResumes()
      if (!isCurrent()) return
      list = [...(Array.isArray(data) ? data : [])].sort(byCreatedDesc)
      setResumes(list)
      setStatus("ready")
    } catch (error) {
      if (!isCurrent()) return
      setLoadError(getErrorMessage(error))
      setStatus("error")
      setAnalysesStatus("error")
      if (shouldShowError(error)) toast.error(getErrorMessage(error))
      return
    }

    const entries = await mapWithConcurrency(list, ANALYSES_CONCURRENCY, async (resume) => {
      try {
        const { data } = await getAnalyses(resume.id)
        return [resume.id, Array.isArray(data) ? data : []]
      } catch {
        return [resume.id, null]
      }
    })
    if (!isCurrent()) return
    setAnalysesById(Object.fromEntries(entries))
    setAnalysesStatus("ready")
  }, [])

  useEffect(() => {
    load()
    // Invalidate the in-flight run on unmount so late responses are ignored.
    return () => {
      runRef.current += 1
    }
  }, [load])

  // After a delete: drop the resume and its analyses without refetching.
  const removeResume = useCallback((id) => {
    setResumes((list) => list.filter((resume) => resume.id !== id))
    setAnalysesById((map) => {
      const next = { ...map }
      delete next[id]
      return next
    })
  }, [])

  return { resumes, status, loadError, analysesById, analysesStatus, reload: load, removeResume }
}
