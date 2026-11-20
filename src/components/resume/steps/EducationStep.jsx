import { Plus } from "lucide-react"
import { LIMITS } from "../../../constants"
import Button from "../../ui/Button"
import FormField from "../../ui/FormField"
import Input from "../../ui/Input"
import ArrayEntryCard from "../ArrayEntryCard"
import { focusSoon } from "../../../utils/focus"

const FIELDS = [
  { key: "institution", label: "Institution", max: LIMITS.institution, required: true },
  { key: "degree", label: "Degree", max: LIMITS.degree, required: true },
  { key: "year", label: "Year", max: LIMITS.year, placeholder: "2024" },
]

export default function EducationStep({ form }) {
  const items = form.data.content.education

  const add = () => {
    const id = form.addItem("education")
    focusSoon(`education-${id}-institution`)
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && <p className="text-text-muted">No education added yet.</p>}
      {items.map((item, index) => (
        <ArrayEntryCard
          key={item.id}
          title={`Education ${index + 1}`}
          onRemove={() => form.removeItem("education", item.id)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {FIELDS.map(({ key, label, max, required, placeholder }) => (
              <FormField
                key={key}
                id={`education-${item.id}-${key}`}
                label={label}
                required={required}
                error={form.errors[`education.${item.id}.${key}`]}
              >
                {(field) => (
                  <Input
                    {...field}
                    placeholder={placeholder}
                    maxLength={max}
                    value={item[key]}
                    onChange={(event) =>
                      form.setItemField("education", item.id, key, event.target.value)
                    }
                  />
                )}
              </FormField>
            ))}
          </div>
        </ArrayEntryCard>
      ))}
      <div>
        <Button variant="secondary" icon={Plus} onClick={add}>
          Add education
        </Button>
      </div>
    </div>
  )
}
