import { LEGAL_LAST_UPDATED } from "../../constants"

// Shared frame and typography for the Privacy Policy and Terms pages.
const PROSE =
  "[&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold " +
  "[&_h3]:mt-6 [&_h3]:font-semibold " +
  "[&_p]:mt-4 [&_p]:leading-7 [&_p]:text-text-muted " +
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:leading-7 [&_li]:text-text-muted " +
  "[&_strong]:font-semibold [&_strong]:text-text " +
  "[&_a]:font-medium [&_a]:text-text [&_a]:underline [&_a]:decoration-accent [&_a]:underline-offset-2"

export default function LegalPage({ title, intro, children }) {
  return (
    <article className={`mx-auto max-w-3xl ${PROSE}`}>
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="!mt-2 text-sm">Last updated: {LEGAL_LAST_UPDATED}</p>
      {intro && <p className="!text-text">{intro}</p>}
      {children}
    </article>
  )
}
