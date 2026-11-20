import { Check } from "lucide-react"

// Display-only progress (docs/design.md §5.6).
export default function StepIndicator({ steps, current }) {
  const currentStep = steps[current - 1]
  return (
    <nav aria-label="Resume builder progress">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const number = index + 1
          const done = number < current
          const active = number === current
          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
            >
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-colors ${
                    done
                      ? "border-primary bg-primary text-white"
                      : active
                        ? "border-accent bg-surface font-semibold text-text"
                        : "border-border bg-surface text-text-muted"
                  }`}
                >
                  {done ? <Check size={16} aria-hidden="true" /> : number}
                </span>
                <span
                  className={`hidden whitespace-nowrap text-xs md:block ${
                    active ? "font-semibold text-text" : "text-text-muted"
                  }`}
                >
                  {step.label}
                </span>
                <span className="sr-only">
                  {done ? "(completed)" : active ? "(current step)" : "(not started)"}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`mx-1 h-0.5 flex-1 md:mx-2 md:-mt-6 ${done ? "bg-primary" : "bg-border"}`}
                />
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-sm text-text-muted md:hidden">
        Step {current} of {steps.length} · {currentStep?.label}
      </p>
    </nav>
  )
}
