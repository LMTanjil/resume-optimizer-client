import { ClipboardPaste, Sparkles, Upload } from "lucide-react"

const STEPS = [
  {
    icon: Upload,
    title: "Upload or build your resume",
    body: "Import an existing PDF, DOCX or Markdown file, or build one step by step with the guided builder.",
  },
  {
    icon: ClipboardPaste,
    title: "Paste a job description",
    body: "Copy the posting you're interested in and paste it in. No reformatting needed.",
  },
  {
    icon: Sparkles,
    title: "Get AI-powered suggestions",
    body: "See your match score, the keywords you cover and the ones you're missing, plus concrete edits to make.",
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="scroll-mt-16 border-y border-border bg-surface"
    >
      <div className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">How it works</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-bold md:text-4xl">
            Three steps to a sharper resume
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, index) => (
            <li
              key={title}
              className="flex flex-col gap-4 rounded-lg border border-border bg-bg p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className="text-3xl font-bold text-text-muted/40" aria-hidden="true">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
