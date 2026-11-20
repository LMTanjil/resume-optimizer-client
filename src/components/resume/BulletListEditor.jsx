import { Plus, X } from "lucide-react"
import { LIMITS } from "../../constants"
import Button from "../ui/Button"
import Input from "../ui/Input"

export default function BulletListEditor({ idPrefix, bullets, onAdd, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text" id={`${idPrefix}-label`}>
        Bullet points
      </span>
      {bullets.length === 0 && <p className="text-sm text-text-muted">No bullet points yet.</p>}
      <ul className="flex flex-col gap-2" aria-labelledby={`${idPrefix}-label`}>
        {bullets.map((bullet, index) => (
          <li key={bullet.id} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-text-muted">
              •
            </span>
            <Input
              id={`${idPrefix}-${bullet.id}`}
              aria-label={`Bullet point ${index + 1}`}
              maxLength={LIMITS.bullet}
              value={bullet.text}
              onChange={(event) => onUpdate(bullet.id, event.target.value)}
            />
            <Button
              variant="ghost"
              iconOnly
              icon={X}
              onClick={() => onRemove(bullet.id)}
              aria-label={`Remove bullet point ${index + 1}`}
            />
          </li>
        ))}
      </ul>
      <div>
        <Button variant="ghost" icon={Plus} onClick={onAdd}>
          Add bullet
        </Button>
      </div>
    </div>
  )
}
