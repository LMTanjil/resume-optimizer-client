// Shared landing-page class strings.

// Small uppercase label above section headings. Primary red on light backgrounds; in dark mode
// red text on navy is below 4.5:1, so it uses the muted text color instead.
export const EYEBROW =
  "text-sm font-semibold uppercase tracking-wide text-primary dark:text-text-muted"

// Icon tile. 10% primary is nearly invisible on the dark surface, so dark mode uses 20% and the
// brighter accent for the icon.
export const ICON_CHIP =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary " +
  "dark:bg-primary/20 dark:text-accent"

// Card hover lift (no movement with reduced motion).
export const LIFT_ON_HOVER =
  "transition-all duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:hover:translate-y-0"
