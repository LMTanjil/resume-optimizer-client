import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import DraftList from "../components/dashboard/DraftList"
import { TOAST_MESSAGES } from "../constants"
import { useAuth } from "../hooks/useAuth"
import { useDrafts } from "../hooks/useDrafts"
import { usePageTitle } from "../hooks/usePageTitle"

// /dashboard/drafts — unsaved drafts kept after a session expiry.
export default function Drafts() {
  usePageTitle("Drafts")
  const navigate = useNavigate()
  const { user } = useAuth()
  const { drafts, deleteDraft } = useDrafts(user?.id)

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
      <h1 className="text-2xl font-bold md:text-3xl">Drafts</h1>
      <DraftList drafts={drafts} onRestore={restoreDraft} onDiscard={discardDraft} />
    </div>
  )
}
