import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useSearchParams } from "react-router-dom"
import ConfirmModal from "../components/common/ConfirmModal"
import ErrorPanel from "../components/common/ErrorPanel"
import DashboardTabs from "../components/dashboard/DashboardTabs"
import { panelId, tabId } from "../components/dashboard/tabIds"
import DraftList from "../components/dashboard/DraftList"
import DraftsBanner from "../components/dashboard/DraftsBanner"
import ResumeGrid from "../components/dashboard/ResumeGrid"
import { TOAST_MESSAGES } from "../constants"
import { useAuth } from "../hooks/useAuth"
import { useDrafts } from "../hooks/useDrafts"
import { usePageTitle } from "../hooks/usePageTitle"
import { deleteResume, getResumes } from "../services/api"
import { getErrorMessage, shouldShowError } from "../utils/apiError"

const byCreatedDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at)

export default function Dashboard() {
  usePageTitle("Dashboard")
  const navigate = useNavigate()
  const { user } = useAuth()
  const { drafts, deleteDraft, deleteDraftForResume, showBanner, dismissBanner } = useDrafts(
    user?.id
  )

  // The tab lives in the URL so the sidebar's Drafts link (/dashboard?tab=drafts) can open it.
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") === "drafts" ? "drafts" : "resumes"
  const setActiveTab = (tab) =>
    setSearchParams(tab === "drafts" ? { tab: "drafts" } : {}, { replace: true })
  const [resumes, setResumes] = useState([])
  const [status, setStatus] = useState("loading") // loading | ready | error
  const [loadError, setLoadError] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadResumes = useCallback(async (isActive = () => true) => {
    setStatus("loading")
    try {
      const { data } = await getResumes()
      if (!isActive()) return
      setResumes([...(Array.isArray(data) ? data : [])].sort(byCreatedDesc))
      setStatus("ready")
    } catch (error) {
      if (!isActive()) return
      setLoadError(getErrorMessage(error))
      setStatus("error")
      if (shouldShowError(error)) toast.error(getErrorMessage(error))
    }
  }, [])

  useEffect(() => {
    let active = true
    loadResumes(() => active)
    return () => {
      active = false
    }
  }, [loadResumes])

  const confirmDelete = async () => {
    const target = deleteTarget
    setDeleting(true)
    try {
      await deleteResume(target.id)
      setResumes((list) => list.filter((resume) => resume.id !== target.id))
      deleteDraftForResume(target.id)
      toast.success(TOAST_MESSAGES.resumeDeleted)
    } catch (error) {
      if (shouldShowError(error)) toast.error(getErrorMessage(error))
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const restoreDraft = (draft) => {
    const path = draft.mode === "edit" ? `/resume/${draft.resumeId}/edit` : "/resume/new"
    navigate(path, { state: { draftId: draft.id } })
  }

  const discardDraft = (draft) => {
    deleteDraft(draft.id)
    toast.success(TOAST_MESSAGES.draftDiscarded)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>

      {showBanner && (
        <DraftsBanner
          count={drafts.length}
          onView={() => setActiveTab("drafts")}
          onDismiss={dismissBanner}
        />
      )}

      <DashboardTabs activeTab={activeTab} onChange={setActiveTab} draftCount={drafts.length} />

      <div
        role="tabpanel"
        id={panelId(activeTab)}
        aria-labelledby={tabId(activeTab)}
        tabIndex={0}
        className="focus:outline-none"
      >
        {activeTab === "resumes" ? (
          status === "error" ? (
            <ErrorPanel message={loadError} onRetry={() => loadResumes()} />
          ) : (
            <ResumeGrid
              resumes={resumes}
              loading={status === "loading"}
              onDelete={setDeleteTarget}
            />
          )
        ) : (
          <DraftList drafts={drafts} onRestore={restoreDraft} onDiscard={discardDraft} />
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete resume?"
        body={`“${deleteTarget?.title || "Untitled resume"}” will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        loadingText="Deleting…"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
