import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { usePageTitle } from "../hooks/usePageTitle"

export default function NotFound() {
  usePageTitle("Page Not Found")
  const { isAuthenticated } = useAuth()

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
      <p className="text-6xl font-bold text-accent" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl font-bold md:text-3xl">Page not found</h1>
      <p className="text-text-muted">Page not found. This page doesn&apos;t exist or was moved.</p>
      <Link
        to={isAuthenticated ? "/dashboard" : "/login"}
        className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {isAuthenticated ? "Go to dashboard" : "Go to login"}
      </Link>
    </section>
  )
}
