import { ArrowRight, Gauge, Sparkles } from "lucide-react"
import Button from "../ui/Button"
import Tag from "../ui/Tag"

// Decorative preview of an analysis result. Hidden from assistive tech.
function AnalysisPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-full bg-accent/15 blur-3xl" />
      <div className="rounded-lg border border-border bg-surface p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-muted">Match score</p>
            <p className="text-4xl font-bold text-success">86%</p>
          </div>
          <Gauge size={36} className="text-accent" />
        </div>
        <div className="mt-4 h-2 rounded-full bg-muted">
          <div className="h-2 w-[86%] rounded-full bg-success" />
        </div>

        <p className="mt-6 text-sm font-semibold">Strengths</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Tag variant="success">React</Tag>
          <Tag variant="success">TypeScript</Tag>
          <Tag variant="success">REST APIs</Tag>
        </div>

        <p className="mt-4 text-sm font-semibold">Missing keywords</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Tag variant="warning">Vite</Tag>
          <Tag variant="warning">WCAG</Tag>
        </div>

        <p className="mt-4 text-sm font-semibold">Suggestion</p>
        <p className="mt-1 text-sm text-text-muted">
          Quantify the impact of your checkout redesign, e.g. &ldquo;cut drop-off by 18%&rdquo;.
        </p>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="overflow-hidden">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium text-text-muted">
            <Sparkles size={16} aria-hidden="true" className="text-accent" />
            AI-powered resume optimization
          </span>
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Tailor your resume to every job you apply for.
          </h1>
          <p className="max-w-xl text-lg text-text-muted">
            Build or import your resume, paste a job description, and get a match score with clear,
            specific suggestions on what to change before you hit apply.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/register" variant="primary" className="px-5">
              Get Started Free
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href="#how-it-works" variant="secondary" className="px-5">
              See How It Works
            </Button>
          </div>
        </div>
        <AnalysisPreview />
      </div>
    </section>
  )
}
