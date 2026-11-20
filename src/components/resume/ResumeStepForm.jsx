import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { NEW_RESUME_EVENT, STEPS, TOAST_MESSAGES } from "../../constants"
import { useAuth } from "../../hooks/useAuth"
import { saveDraftFor, useDrafts } from "../../hooks/useDrafts"
import { useResumeForm } from "../../hooks/useResumeForm"
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges"
import { getErrorMessage, shouldShowError } from "../../utils/apiError"
import { onSessionExpired } from "../../utils/authEvents"
import { emptyFormData, mergeImported, newId, snapshot } from "../../utils/resumeData"
import { findFirstInvalidStep, validateImportFile } from "../../utils/validation"
import BackLink from "../common/BackLink"
import ConfirmModal from "../common/ConfirmModal"
import StepActions from "./StepActions"
import StepIndicator from "./StepIndicator"
import BasicInfoStep from "./steps/BasicInfoStep"
import ContactStep from "./steps/ContactStep"
import EducationStep from "./steps/EducationStep"
import ExperienceStep from "./steps/ExperienceStep"
import ProjectsStep from "./steps/ProjectsStep"
import SkillsStep from "./steps/SkillsStep"

const STEP_COMPONENTS = [
  ContactStep,
  BasicInfoStep,
  ExperienceStep,
  EducationStep,
  SkillsStep,
  ProjectsStep,
]

const focusFirstInvalid = (container) =>
  requestAnimationFrame(() => container?.querySelector("[aria-invalid='true']")?.focus())

/**
 * Multi-step builder (docs/functional-requirements.md §5).
 * The step lives in router history state, not the URL (FR-BLD-05).
 */
export default function ResumeStepForm({
  mode,
  resumeId,
  initialData,
  initialStep = 1,
  draft = null,
  onSave,
  onImport,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { deleteDraft } = useDrafts(user?.id)

  const form = useResumeForm(initialData, { dirtyFromStart: Boolean(draft) })
  const { blocker, bypass } = useUnsavedChanges(form.isDirty)

  const [activeDraft, setActiveDraft] = useState(draft)
  const [saving, setSaving] = useState(false)
  const [resetPending, setResetPending] = useState(false)
  const [importing, setImporting] = useState(false)
  const importAbortRef = useRef(null)
  const sessionKeyRef = useRef(draft?.sessionKey ?? newId())
  const containerRef = useRef(null)
  const headingRef = useRef(null)

  const pathname = location.pathname
  const step = Math.min(Math.max(Number(location.state?.step) || 1, 1), STEPS.length)
  const StepComponent = STEP_COMPONENTS[step - 1]

  const goToStep = useCallback(
    (next, { replace = false, viaNext = false } = {}) =>
      navigate(pathname, { replace, state: { ...location.state, step: next, viaNext } }),
    [navigate, pathname, location.state]
  )

  // Fresh entry: start at Step 1 (or the restored draft's step), replacing whatever was in history.
  const mountedRef = useRef(false)
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    goToStep(initialStep, { replace: true })
  }, [goToStep, initialStep])

  // Guard against reaching a step while an earlier step is invalid (e.g. browser Forward).
  const dataRef = useRef(form.data)
  dataRef.current = form.data
  useEffect(() => {
    const firstInvalid = findFirstInvalidStep(dataRef.current, step - 1)
    if (firstInvalid) goToStep(firstInvalid, { replace: true })
    // Only re-check when the step changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Move focus to the step heading after a step change (not on first render).
  const previousStep = useRef(step)
  useEffect(() => {
    if (previousStep.current !== step) headingRef.current?.focus()
    previousStep.current = step
  }, [step])

  // Save a draft if the session expires while there are unsaved changes (FR-DRAFT-01).
  const latest = useRef({})
  latest.current = { form, step, mode, resumeId, user, activeDraft }
  useEffect(
    () =>
      onSessionExpired(() => {
        const { form: f, step: s, mode: m, resumeId: rid, user: u, activeDraft: d } = latest.current
        if (!f.isDirty || !u) return
        const payload = f.getPayload()
        saveDraftFor(u.id, {
          id: d?.id ?? newId(),
          mode: m,
          resumeId: m === "edit" ? rid : null,
          sessionKey: sessionKeyRef.current,
          title: payload.title,
          data: payload,
          step: s,
        })
      }),
    []
  )

  // Navbar "New Resume" while already on /resume/new.
  useEffect(() => {
    if (mode !== "create") return undefined
    const onNewResume = () => {
      if (latest.current.form.isDirty) setResetPending(true)
    }
    window.addEventListener(NEW_RESUME_EVENT, onNewResume)
    return () => window.removeEventListener(NEW_RESUME_EVENT, onNewResume)
  }, [mode])

  // Cancel an in-flight import when the builder unmounts.
  useEffect(() => () => importAbortRef.current?.abort(), [])

  // Import from file (FR-BLD-14): upload, then merge the extracted data into the form.
  const handleImport = async (file) => {
    if (importing) return
    const fileError = validateImportFile(file)
    if (fileError) {
      toast.error(fileError)
      return
    }

    const controller = new AbortController()
    importAbortRef.current = controller
    setImporting(true)
    try {
      const { data } = await onImport(file, { signal: controller.signal })
      const current = dataRef.current
      const merged = mergeImported(current, data)
      if (snapshot(merged) === snapshot(current)) {
        toast.error(TOAST_MESSAGES.importEmpty)
      } else {
        form.importData(merged)
        toast.success(TOAST_MESSAGES.resumeImported)
      }
    } catch (error) {
      if (shouldShowError(error)) toast.error(getErrorMessage(error))
    } finally {
      if (!controller.signal.aborted) setImporting(false)
    }
  }

  const handleNext = () => {
    if (form.validateCurrentStep(step)) goToStep(step + 1, { viaNext: true })
    else focusFirstInvalid(containerRef.current)
  }

  const handleBack = () => {
    if (step === 1) return
    if (location.state?.viaNext) navigate(-1)
    else goToStep(step - 1, { replace: true })
  }

  const handleSave = async () => {
    const firstInvalid = form.validateAll()
    if (firstInvalid) {
      toast.error(TOAST_MESSAGES.completeRequired)
      if (firstInvalid !== step) goToStep(firstInvalid, { replace: true })
      focusFirstInvalid(containerRef.current)
      return
    }

    setSaving(true)
    try {
      await onSave(form.getPayload())
      form.markSaved()
      if (activeDraft) deleteDraft(activeDraft.id)
      bypass()
      toast.success(TOAST_MESSAGES.resumeSaved)
      navigate("/dashboard/resumes")
    } catch (error) {
      if (shouldShowError(error)) toast.error(getErrorMessage(error))
      setSaving(false)
    }
  }

  const discardTitle = activeDraft ? "Discard this draft?" : "Discard unsaved changes?"
  const discardBody = activeDraft
    ? "This draft will be permanently deleted."
    : "Your changes will be lost."

  const confirmDiscard = () => {
    if (activeDraft) deleteDraft(activeDraft.id)
    if (resetPending) {
      setResetPending(false)
      setActiveDraft(null)
      sessionKeyRef.current = newId()
      form.reset(emptyFormData(user?.name ?? ""))
      navigate(pathname, { replace: true, state: { step: 1, viaNext: false } })
      return
    }
    blocker.proceed?.()
  }

  const cancelDiscard = () => {
    if (resetPending) setResetPending(false)
    else blocker.reset?.()
  }

  return (
    <div ref={containerRef} className="mx-auto flex max-w-3xl flex-col gap-6">
      <BackLink to="/dashboard/resumes" />
      <h1 className="text-2xl font-bold md:text-3xl">
        {mode === "edit" ? "Edit resume" : "Create resume"}
      </h1>

      <StepIndicator steps={STEPS} current={step} />

      <section
        key={step}
        aria-labelledby="step-heading"
        className="flex flex-col gap-6 motion-safe:animate-fade-in"
      >
        <h2
          id="step-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold focus:outline-none"
        >
          {STEPS[step - 1].label}
        </h2>
        <StepComponent
          form={form}
          importer={onImport ? { importing, onFile: handleImport } : null}
        />
      </section>

      <StepActions
        mode={mode}
        step={step}
        total={STEPS.length}
        saving={saving}
        busy={importing}
        onCancel={() => navigate("/dashboard/resumes")}
        onBack={handleBack}
        onNext={handleNext}
        onSave={handleSave}
      />

      <ConfirmModal
        open={blocker.state === "blocked" || resetPending}
        title={discardTitle}
        body={discardBody}
        cancelLabel="Keep editing"
        cancelVariant="secondary"
        confirmLabel="Discard"
        onConfirm={confirmDiscard}
        onCancel={cancelDiscard}
      />
    </div>
  )
}
