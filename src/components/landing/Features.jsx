import { FileDown, FilePen, Gauge, History, Sparkles, Upload } from "lucide-react"
import { EYEBROW, ICON_CHIP, LIFT_ON_HOVER } from "./styles"
import Reveal from "./Reveal"

const FEATURES = [
  {
    icon: FilePen,
    title: "Resume builder",
    body: "A guided six-step builder for contact details, summary, experience, education, skills and projects.",
  },
  {
    icon: Sparkles,
    title: "AI analysis",
    body: "Compare your resume with any job description and get specific, actionable suggestions.",
  },
  {
    icon: Gauge,
    title: "Match score",
    body: "A 0–100 score shows how well you fit the role, with your strengths and missing keywords listed.",
  },
  {
    icon: FileDown,
    title: "PDF export",
    body: "Download a clean PDF of your resume together with its latest analysis.",
  },
  {
    icon: Upload,
    title: "File import",
    body: "Start from your existing resume. Import a PDF, DOCX or Markdown file and review what we extracted.",
  },
  {
    icon: History,
    title: "Analysis history",
    body: "Keep your recent analyses for each resume and track how your score improves as you edit.",
  },
]

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-16 bg-muted">
      <Reveal className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className={EYEBROW}>Features</p>
          <h2 id="features-heading" className="mt-2 text-3xl font-bold md:text-4xl">
            Everything you need to apply with confidence
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className={`flex flex-col justify-between gap-6 rounded-lg border border-border border-l-4 border-l-primary bg-surface p-6 shadow-sm ${LIFT_ON_HOVER}`}
            >
              <div className="flex flex-col gap-3">
                <span className={ICON_CHIP}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-text-muted">{body}</p>
              </div>
              {/* Decorative only: not a link, hidden from screen readers. */}
              <span
                aria-hidden="true"
                className="cursor-default text-sm font-medium text-text-muted"
              >
                Learn more →
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
