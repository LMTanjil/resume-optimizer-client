import { useState } from "react"
import toast from "react-hot-toast"
import ConfirmModal from "../components/common/ConfirmModal"
import ErrorPanel from "../components/common/ErrorPanel"
import ResumeGrid from "../components/dashboard/ResumeGrid"
import { TOAST_MESSAGES } from "../constants"
import { useAuth } from "../hooks/useAuth"
import { useDrafts } from "../hooks/useDrafts"
import { usePageTitle } from "../hooks/usePageTitle"
import { useResumesWithAnalyses } from "../hooks/useResumesWithAnalyses"
import { deleteResume } from "../services/api"
import { getErrorMessage, shouldShowError } from "../utils/apiError"

// /dashboard/resumes — the resume grid with Analyze, Edit and Delete.
export default function MyResumes() {
  usePageTitle("My Resumes")
  const { user } = useAuth()
  const { deleteDraftForResume } = useDrafts(user?.id)
  const { resumes, status, loadError, reload, removeResume } = useResumesWithAnalyses({
    withAnalyses: false,
  })

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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold md:text-3xl">My Resumes</h1>

      {status === "error" ? (
        <ErrorPanel message={loadError} onRetry={reload} />
      ) : (
        <ResumeGrid resumes={resumes} loading={status === "loading"} onDelete={setDeleteTarget} />
      )}

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
