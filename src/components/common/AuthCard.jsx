import { Link } from "react-router-dom"

// Shared frame for the Login and Register forms.
export default function AuthCard({ title, subtitle, children, footerText, footerLink, footerTo }) {
  return (
    <section className="mx-auto w-full max-w-md">
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-6 text-center text-sm text-text-muted">
        {footerText}{" "}
        <Link
          to={footerTo}
          className="rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {footerLink}
        </Link>
      </p>
    </section>
  )
}
