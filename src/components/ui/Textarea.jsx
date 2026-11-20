import { forwardRef } from "react"
import { FIELD_CLASSES } from "./Input"

const Textarea = forwardRef(function Textarea(
  { invalid = false, showCounter = false, className = "", value = "", maxLength, ...rest },
  ref
) {
  return (
    <div>
      <textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        className={`min-h-32 resize-y py-2 leading-relaxed ${FIELD_CLASSES} ${
          invalid ? "border-warning" : "border-border"
        } ${className}`}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {showCounter && maxLength && (
        <p className="mt-1 text-right text-sm text-text-muted" aria-live="off">
          {value.length.toLocaleString("en-US")} / {maxLength.toLocaleString("en-US")}
        </p>
      )}
    </div>
  )
})

export default Textarea
