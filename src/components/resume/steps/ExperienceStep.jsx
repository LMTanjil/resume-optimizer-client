import { Plus } from "lucide-react"
import { LIMITS } from "../../../constants"
import Button from "../../ui/Button"
import FormField from "../../ui/FormField"
import Input from "../../ui/Input"
import ArrayEntryCard from "../ArrayEntryCard"
import BulletListEditor from "../BulletListEditor"
import { focusSoon } from "../../../utils/focus"

const FIELDS = [
  { key: "company", label: "Company", max: LIMITS.company },
  { key: "role", label: "Role", max: LIMITS.role },
  { key: "duration", label: "Duration", max: LIMITS.duration, placeholder: "Jan 2023 - Present" },
]

export default function ExperienceStep({ form }) {
  const items = form.data.content.experience

  const add = () => {
    const id = form.addItem("experience")
    focusSoon(`experience-${id}-company`)
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && <p className="text-text-muted">No experience added yet.</p>}
      {items.map((item, index) => (
        <ArrayEntryCard
          key={item.id}
          title={`Experience ${index + 1}`}
          onRemove={() => form.removeItem("experience", item.id)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {FIELDS.map(({ key, label, max, placeholder }) => (
              <FormField
                key={key}
                id={`experience-${item.id}-${key}`}
                label={label}
                required
                error={form.errors[`experience.${item.id}.${key}`]}
              >
                {(field) => (
                  <Input
                    {...field}
                    placeholder={placeholder}
                    maxLength={max}
                    value={item[key]}
                    onChange={(event) =>
                      form.setItemField("experience", item.id, key, event.target.value)
                    }
                  />
                )}
              </FormField>
            ))}
          </div>
          <BulletListEditor
            idPrefix={`experience-${item.id}-bullet`}
            bullets={item.bullets}
            onAdd={() => {
              const bulletId = form.addBullet(item.id)
              focusSoon(`experience-${item.id}-bullet-${bulletId}`)
            }}
            onUpdate={(bulletId, text) => form.updateBullet(item.id, bulletId, text)}
            onRemove={(bulletId) => form.removeBullet(item.id, bulletId)}
          />
        </ArrayEntryCard>
      ))}
      <div>
        <Button variant="secondary" icon={Plus} onClick={add}>
          Add experience
        </Button>
      </div>
    </div>
  )
}
