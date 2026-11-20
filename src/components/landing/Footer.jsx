import { Link } from "react-router-dom"
import { APP_NAME } from "../../constants"

const LINK_CLASSES =
  "rounded text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-accent"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6 lg:px-8">
        <div className="max-w-sm">
          <Link
            to="/"
            className="rounded-lg text-xl font-bold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {APP_NAME}
          </Link>
          <p className="mt-3 text-sm text-text-muted">
            Build, tailor and analyze your resume against any job description with AI.
          </p>
        </div>

        <nav aria-label="Legal">
          <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <li>
              <Link to="/privacy-policy" className={LINK_CLASSES}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className={LINK_CLASSES}>
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-content px-4 py-6 text-sm text-text-muted md:px-6 lg:px-8">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
