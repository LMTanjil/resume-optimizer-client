import { Link } from "react-router-dom"
import { APP_NAME } from "../../constants"

const LINK_CLASSES =
  "rounded text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-accent"

const PRODUCT_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
]

const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-and-conditions", label: "Terms and Conditions" },
]

function Column({ id, title, children }) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="text-sm font-semibold uppercase tracking-wide">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-3">{children}</ul>
    </nav>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr] md:px-6 md:py-16 lg:px-8">
        <div className="flex max-w-sm flex-col gap-3">
          <Link
            to="/"
            className="self-start rounded-lg text-xl font-bold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {APP_NAME}
          </Link>
          <p className="text-sm text-text-muted">
            Build, tailor and analyze your resume against any job description.
          </p>
          <p className="mt-auto pt-4 text-sm text-text-muted">
            © {year} {APP_NAME}. All rights reserved.
          </p>
        </div>

        <Column id="footer-product" title="Product">
          {PRODUCT_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={LINK_CLASSES}>
                {link.label}
              </a>
            </li>
          ))}
        </Column>

        <Column id="footer-legal" title="Legal">
          {LEGAL_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={LINK_CLASSES}>
                {link.label}
              </Link>
            </li>
          ))}
        </Column>
      </div>
    </footer>
  )
}
