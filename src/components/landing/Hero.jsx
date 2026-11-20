import { ArrowRight, FileText, Gauge, Sparkles } from "lucide-react"
import Button from "../ui/Button"
import Tag from "../ui/Tag"
import Reveal from "./Reveal"
import { ICON_CHIP } from "./styles"

// Decorative preview of an analysis result, styled like the real app. Hidden from assistive tech.
function AnalysisPreview() {
  return (
    <div aria-hidden="true" className="relative isolate mx-auto w-full max-w-md">
      {/* Soft primary glow behind the card (10% primary, fades to transparent). */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(var(--color-primary)/0.10),transparent)]" />

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
        {/* Card header, like the Analyze page */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/60 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText size={16} className="shrink-0 text-text-muted" />
            <span className="truncate text-sm font-medium">Frontend Developer Resume</span>
          </div>
          <span className="shrink-0 text-xs text-text-muted">Just now</span>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted">Match score</p>
              <p className="text-4xl font-bold">86%</p>
            </div>
            <span className={ICON_CHIP}>
              <Gauge size={24} />
            </span>
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

          <div className="mt-5 rounded-lg border border-border bg-bg p-3">
            <p className="text-sm font-semibold">Suggestion</p>
            <p className="mt-1 text-sm text-text-muted">
              Quantify the impact of your checkout redesign, e.g. &ldquo;cut drop-off by 18%&rdquo;.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wave into the About section (muted). Inherits the muted token in both themes.
function WaveDivider() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className="block h-8 w-full fill-muted md:h-12"
    >
      <path d="M0 24C240 48 480 48 720 24S1200 0 1440 24V48H0Z" />
    </svg>
  )
}

export default function Hero() {
  return (
    // Radial gradient: card surface in the middle fading to the page background
    // (white → cream in light mode, lighter navy → page navy in dark mode).
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-bg bg-[radial-gradient(ellipse_at_top,rgb(var(--color-surface)),rgb(var(--color-bg))_70%)]"
    >
      <Reveal className="mx-auto grid max-w-content items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium text-text-muted shadow-sm">
            <Sparkles size={16} aria-hidden="true" className="text-primary dark:text-accent" />
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
              {/* inline-flex keeps the arrow on the text's line (preflight makes svg a block) */}
              <span className="inline-flex items-center gap-2">
                Get Started Free
                <ArrowRight size={18} aria-hidden="true" />
              </span>
            </Button>
            <Button href="#how-it-works" variant="secondary" className="px-5">
              See How It Works
            </Button>
          </div>
        </div>
        <AnalysisPreview />
      </Reveal>
      <WaveDivider />
    </section>
  )
}
