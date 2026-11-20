import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Accessible dialog: focus trap, Esc to close, focus returns to the trigger,
// background made inert (docs/non-functional-requirements.md §3.2).
export default function Modal({ open, onClose, titleId, initialFocusRef, children }) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const trigger = document.activeElement
    const root = document.getElementById("root")
    if (root) root.inert = true

    const focusTarget =
      initialFocusRef?.current ?? panelRef.current?.querySelector(FOCUSABLE) ?? panelRef.current
    focusTarget?.focus()

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        onCloseRef.current?.()
        return
      }
      if (event.key !== "Tab" || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      if (root) root.inert = false
      if (trigger instanceof HTMLElement && document.contains(trigger)) trigger.focus()
    }
  }, [open, initialFocusRef])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 motion-safe:animate-fade-in"
        aria-hidden="true"
        onClick={() => onCloseRef.current?.()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-xl motion-safe:animate-modal-in"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
