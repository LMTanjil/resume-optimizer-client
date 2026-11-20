import DraftCard from "./DraftCard"
import EmptyState from "./EmptyState"
import { GRID_CLASSES } from "./ResumeGrid"

export default function DraftList({ drafts, onRestore, onDiscard }) {
  if (drafts.length === 0) return <EmptyState message="No unsaved drafts." />
  return (
    <div className={GRID_CLASSES}>
      {drafts.map((draft) => (
        <DraftCard key={draft.id} draft={draft} onRestore={onRestore} onDiscard={onDiscard} />
      ))}
    </div>
  )
}
