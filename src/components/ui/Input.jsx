import { forwardRef } from "react"

export const FIELD_CLASSES =
  "w-full rounded-lg border bg-surface px-3 text-base text-text placeholder:text-text-muted " +
  "transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 " +
  "focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"

const Input = forwardRef(function Input({ invalid = false, className = "", ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={`h-10 ${FIELD_CLASSES} ${invalid ? "border-warning" : "border-border"} ${className}`}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
})

export default Input
