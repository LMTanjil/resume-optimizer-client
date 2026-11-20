export default function Spinner({ size = 16, page = false, label = "Loading…" }) {
  const spinner = (
    <span role="status" className="inline-flex items-center">
      <span
        aria-hidden="true"
        className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: size, height: size }}
      />
      <span className="sr-only">{label}</span>
    </span>
  )

  if (!page) return spinner
  return <div className="flex min-h-[40vh] items-center justify-center text-accent">{spinner}</div>
}
