import { FileDown, FilePen, Gauge, History, Sparkles, Upload } from "lucide-react"

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
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-16">
      <div className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Features</p>
          <h2 id="features-heading" className="mt-2 text-3xl font-bold md:text-4xl">
            Everything you need to apply with confidence
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
