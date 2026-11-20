import { ClipboardPaste, Sparkles, Upload } from "lucide-react"
import { EYEBROW, ICON_CHIP, LIFT_ON_HOVER } from "./styles"
import Reveal from "./Reveal"

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
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-16 bg-bg">
      <Reveal className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className={EYEBROW}>How it works</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-bold md:text-4xl">
            Three steps to a sharper resume
          </h2>
        </div>

        <ol className="relative isolate mt-12 grid gap-8 md:grid-cols-3">
          {/* Dashed line connecting the steps (desktop), behind the cards. */}
          <li
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[16%] top-1/2 -z-10 hidden border-t-2 border-dashed border-border md:block"
          />
          {STEPS.map(({ icon: Icon, title, body }, index) => (
            <li
              key={title}
              className={`relative flex flex-col gap-4 overflow-hidden rounded-lg border border-border border-t-2 border-t-primary bg-surface p-6 shadow-sm ${LIFT_ON_HOVER}`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-2 select-none text-6xl font-bold leading-none text-primary/15 dark:text-primary/30"
              >
                {index + 1}
              </span>
              <span className={ICON_CHIP}>
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">
                <span className="sr-only">Step {index + 1}: </span>
                {title}
              </h3>
              <p className="text-text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
