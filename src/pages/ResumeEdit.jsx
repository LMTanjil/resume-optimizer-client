import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ResumeStepForm from "../components/resume/ResumeStepForm"
import Skeleton from "../components/ui/Skeleton"
import { TOAST_MESSAGES } from "../constants"
import { useAuth } from "../hooks/useAuth"
import { useDrafts } from "../hooks/useDrafts"
import { usePageTitle } from "../hooks/usePageTitle"
import { getResume, importResume, updateResume } from "../services/api"
import { getErrorMessage, isNotFound, shouldShowError } from "../utils/apiError"
import { toFormData } from "../utils/resumeData"

function EditSkeleton() {
  return (
    <div
      className="mx-auto flex max-w-3xl flex-col gap-6"
      aria-busy="true"
      aria-label="Loading resume"
    >
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  )
}

export default function ResumeEdit() {
  usePageTitle("Edit Resume")
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { getDraft, deleteDraft } = useDrafts(user?.id)
  const [setup, setSetup] = useState(null)

  const draftId = location.state?.draftId

  useEffect(() => {
    let active = true
    const draft = draftId ? getDraft(draftId) : null
    const matchingDraft =
      draft && draft.mode === "edit" && String(draft.resumeId) === String(id) ? draft : null

    getResume(id)
      .then(({ data }) => {
        if (!active) return
        setSetup(
          matchingDraft
            ? {
                initialData: toFormData(matchingDraft.data),
                initialStep: matchingDraft.step || 1,
                draft: { id: matchingDraft.id, sessionKey: matchingDraft.sessionKey },
              }
            : { initialData: toFormData(data), initialStep: 1, draft: null }
        )
      })
      .catch((error) => {
        if (!active || !shouldShowError(error)) return
        if (isNotFound(error)) {
          if (matchingDraft) {
            deleteDraft(matchingDraft.id)
            toast.error(TOAST_MESSAGES.resumeGone)
          } else {
            toast.error(TOAST_MESSAGES.resumeNotFound)
          }
        } else {
          toast.error(getErrorMessage(error))
        }
        navigate("/dashboard", { replace: true })
      })

    return () => {
      active = false
    }
    // Load once per resume id / draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, draftId])

  if (!setup) return <EditSkeleton />

  return (
    <ResumeStepForm
      key={`${id}-${setup.draft?.id ?? "server"}`}
      mode="edit"
      resumeId={id}
      initialData={setup.initialData}
      initialStep={setup.initialStep}
      draft={setup.draft}
      onSave={(payload) => updateResume(id, payload)}
      onImport={importResume}
    />
  )
}
