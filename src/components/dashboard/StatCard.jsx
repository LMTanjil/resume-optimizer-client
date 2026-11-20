import Skeleton from "../ui/Skeleton"

// One number on the Overview stats row. `value` null/undefined while loading shows a skeleton.
export default function StatCard({ icon: Icon, label, value, loading = false }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm md:p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={24} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-text-muted">{label}</p>
        {loading ? (
          <Skeleton className="mt-1 h-8 w-16" />
        ) : (
          <p className="text-2xl font-bold md:text-3xl">{value}</p>
        )}
      </div>
    </div>
  )
}
