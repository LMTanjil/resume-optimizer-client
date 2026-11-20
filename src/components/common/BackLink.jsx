import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function BackLink({ to = "/dashboard", children = "Back to dashboard" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {children}
    </Link>
  )
}
