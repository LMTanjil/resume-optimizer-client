import { useId, useRef } from "react"
import Button from "../ui/Button"
import Modal from "../ui/Modal"

// Used for "Delete resume?" and "Discard unsaved changes?" dialogs.
export default function ConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Cancel",
  cancelVariant = "ghost",
  confirmVariant = "destructive",
  loading = false,
  loadingText,
  onConfirm,
  onCancel,
}) {
  const titleId = useId()
  const cancelRef = useRef(null)

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onCancel}
      titleId={titleId}
      initialFocusRef={cancelRef}
    >
      <h2 id={titleId} className="text-lg font-semibold text-text">
        {title}
      </h2>
      {body && <p className="mt-2 text-text-muted">{body}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button ref={cancelRef} variant={cancelVariant} onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
          loadingText={loadingText}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
