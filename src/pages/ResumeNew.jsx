import { useState } from "react"
import { useLocation } from "react-router-dom"
import ResumeStepForm from "../components/resume/ResumeStepForm"
import { useAuth } from "../hooks/useAuth"
import { readDrafts } from "../hooks/useDrafts"
import { usePageTitle } from "../hooks/usePageTitle"
import { createResume, importResume } from "../services/api"
import { emptyFormData, toFormData } from "../utils/resumeData"

export default function ResumeNew() {
  usePageTitle("New Resume")
  const { user } = useAuth()
  const location = useLocation()

  // Computed once per mount: either a restored create-mode draft or an empty resume.
  const [setup] = useState(() => {
    const draftId = location.state?.draftId
    const draft = draftId
      ? readDrafts(user?.id).find((d) => d.id === draftId && d.mode === "create")
      : null
    if (draft) {
      return {
        initialData: toFormData(draft.data),
        initialStep: draft.step || 1,
        draft: { id: draft.id, sessionKey: draft.sessionKey },
      }
    }
    return { initialData: emptyFormData(user?.name ?? ""), initialStep: 1, draft: null }
  })

  return (
    <ResumeStepForm
      mode="create"
      initialData={setup.initialData}
      initialStep={setup.initialStep}
      draft={setup.draft}
      onSave={(payload) => createResume(payload)}
      onImport={importResume}
    />
  )
}
