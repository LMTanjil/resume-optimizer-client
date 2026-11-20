// Label + control + helper/error with aria wiring.
// `children` is a function receiving the props to spread on the control.
export default function FormField({ id, label, required = false, error, helper, children }) {
  const errorId = error ? `${id}-error` : undefined
  const helperId = helper ? `${id}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-warning">
            *
          </span>
        )}
      </label>
      {children({
        id,
        invalid: Boolean(error),
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}
      {helper && !error && (
        <p id={helperId} className="text-sm text-text-muted">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-warning">
          {error}
        </p>
      )}
    </div>
  )
}
