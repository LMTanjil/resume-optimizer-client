import { Shield, Target, Zap } from "lucide-react"
import Reveal from "./Reveal"
import { EYEBROW, ICON_CHIP } from "./styles"

const VALUES = [
  { icon: Zap, text: "Fast analysis in seconds" },
  { icon: Target, text: "Specific, actionable suggestions" },
  { icon: Shield, text: "Your data stays yours" },
]

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-16 bg-muted">
      <Reveal className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6 md:py-24">
        <p className={EYEBROW}>About</p>
        <h2 id="about-heading" className="mt-2 text-3xl font-bold md:text-4xl">
          Built for job seekers who take applications seriously
        </h2>
        <p className="mt-6 text-lg leading-8 text-text-muted">
          ResumeAI helps you tailor your resume to every job you apply for. Paste a job description,
          get a match score, and see exactly what to add, remove, or reword — so you spend less time
          guessing and more time applying.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex flex-col items-center gap-3">
              <span className={`${ICON_CHIP} rounded-full`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">{text}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
