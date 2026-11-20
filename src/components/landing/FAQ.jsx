import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { IMPORT_MAX_MB } from "../../constants"

const QUESTIONS = [
  {
    q: "What does ResumeAI do?",
    a: "ResumeAI helps you build a resume and tailor it to specific jobs. You create or import your resume, paste a job description, and get a match score with suggestions on what to improve. You can then export the resume and its analysis as a PDF.",
  },
  {
    q: "How does the AI analysis work?",
    a: "When you run an analysis, your resume's content and the job description are sent to an AI model that compares them. It returns a match score from 0 to 100, the strengths it found, the keywords you're missing and concrete suggestions. It never edits your resume for you; you decide what to change.",
  },
  {
    q: "Which file formats can I import?",
    a: `PDF (.pdf), Word (.docx) and Markdown (.md), up to ${IMPORT_MAX_MB} MB. The details we extract are filled into the builder so you can review and correct them before saving.`,
  },
  {
    q: "Is my data saved?",
    a: (
      <>
        Resumes you save and the analyses you run are stored in your account so you can come back to
        them, and you can delete a resume from your dashboard at any time. Imported files are only
        used to fill in the builder; nothing is added to your account until you click Save. Unsaved
        drafts stay in your browser. See our{" "}
        <Link to="/privacy-policy" className="font-medium text-text underline decoration-accent">
          Privacy Policy
        </Link>{" "}
        for details.
      </>
    ),
  },
  {
    q: "Is ResumeAI free?",
    a: "Yes. Creating an account, building resumes, running analyses and exporting PDFs are free.",
  },
  {
    q: "Does a high match score guarantee an interview?",
    a: "No. The score is a guide to how closely your resume matches the wording and requirements of a posting. Hiring decisions depend on many other factors, so always review suggestions with your own judgment.",
  },
]

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-16 border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">FAQ</p>
          <h2 id="faq-heading" className="mt-2 text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {QUESTIONS.map(({ q, a }) => (
            <details key={q} className="group rounded-lg border border-border bg-bg">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg p-5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 leading-7 text-text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
