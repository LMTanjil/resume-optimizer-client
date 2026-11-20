import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useSearchParams } from "react-router-dom"
import ConfirmModal from "../components/common/ConfirmModal"
import ErrorPanel from "../components/common/ErrorPanel"
import DashboardTabs from "../components/dashboard/DashboardTabs"
import DraftList from "../components/dashboard/DraftList"
import DraftsBanner from "../components/dashboard/DraftsBanner"
import OverviewPanel from "../components/dashboard/OverviewPanel"
import ResumeGrid from "../components/dashboard/ResumeGrid"
import { DASHBOARD_TABS, panelId, tabId } from "../components/dashboard/tabIds"
import { TOAST_MESSAGES } from "../constants"
import { useAuth } from "../hooks/useAuth"
import { useDrafts } from "../hooks/useDrafts"
import { usePageTitle } from "../hooks/usePageTitle"
import { useResumesWithAnalyses } from "../hooks/useResumesWithAnalyses"
import { deleteResume } from "../services/api"
import { getErrorMessage, shouldShowError } from "../utils/apiError"

const DEFAULT_TAB = "overview"

export default function Dashboard() {
  usePageTitle("Dashboard")
  const navigate = useNavigate()
  const { user } = useAuth()
  const { drafts, deleteDraft, deleteDraftForResume, showBanner, dismissBanner } = useDrafts(
    user?.id
  )
  const { resumes, status, loadError, analysesById, analysesStatus, reload, removeResume } =
    useResumesWithAnalyses()

  // The tab lives in the URL (?tab=resumes | drafts) so the sidebar's Drafts link can open it.
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get("tab")
  const activeTab = DASHBOARD_TABS.some((tab) => tab.key === requested) ? requested : DEFAULT_TAB
  const setActiveTab = (tab) =>
    setSearchParams(tab === DEFAULT_TAB ? {} : { tab }, { replace: true })

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    const target = deleteTarget
    setDeleting(true)
    try {
      await deleteResume(target.id)
      removeResume(target.id)
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

  const panels = {
    overview: (
      <OverviewPanel
        resumes={resumes}
        status={status}
        loadError={loadError}
        analysesById={analysesById}
        analysesStatus={analysesStatus}
        onRetry={reload}
      />
    ),
    resumes:
      status === "error" ? (
        <ErrorPanel message={loadError} onRetry={reload} />
      ) : (
        <ResumeGrid resumes={resumes} loading={status === "loading"} onDelete={setDeleteTarget} />
      ),
    drafts: <DraftList drafts={drafts} onRestore={restoreDraft} onDiscard={discardDraft} />,
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
        {panels[activeTab]}
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
