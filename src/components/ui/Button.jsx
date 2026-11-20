import { forwardRef } from "react"
import { Link } from "react-router-dom"
import Spinner from "./Spinner"

// Button hierarchy — docs/design.md §5.1.
const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover border border-transparent",
  secondary: "border border-text/70 text-text hover:bg-muted",
  destructive: "border border-warning text-warning hover:bg-warning-tint",
  ghost: "border border-transparent text-text-muted hover:bg-muted hover:text-text",
}

const BASE =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium " +
  "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:cursor-not-allowed disabled:opacity-50"

const Button = forwardRef(function Button(
  {
    variant = "secondary",
    type = "button",
    loading = false,
    loadingText,
    icon: Icon,
    iconOnly = false,
    hideLabelBelowMd = false,
    to,
    href,
    className = "",
    disabled,
    children,
    ...rest
  },
  ref
) {
  const sizing = iconOnly ? "w-10" : hideLabelBelowMd ? "w-10 md:w-auto md:px-4" : "px-4"
  const classes = `${BASE} ${VARIANTS[variant]} ${sizing} ${className}`

  const content = (
    <>
      {loading ? <Spinner size={16} /> : Icon && <Icon size={18} aria-hidden="true" />}
      {!iconOnly && (
        <span className={hideLabelBelowMd ? "sr-only md:not-sr-only" : undefined}>
          {loading && loadingText ? loadingText : children}
        </span>
      )}
    </>
  )

  // In-page anchors (e.g. "#how-it-works") need a plain <a>, not a router Link.
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  )
})

export default Button
