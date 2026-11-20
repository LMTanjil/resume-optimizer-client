import { Plus } from "lucide-react"
import { LIMITS } from "../../../constants"
import Button from "../../ui/Button"
import FormField from "../../ui/FormField"
import Input from "../../ui/Input"
import Textarea from "../../ui/Textarea"
import ArrayEntryCard from "../ArrayEntryCard"
import TagInput from "../TagInput"
import { focusSoon } from "../../../utils/focus"

export default function ProjectsStep({ form }) {
  const items = form.data.content.projects

  const add = () => {
    const id = form.addItem("projects")
    focusSoon(`projects-${id}-name`)
  }

  const errorFor = (item, field) => form.errors[`projects.${item.id}.${field}`]
  const set = (item, field) => (event) =>
    form.setItemField("projects", item.id, field, event.target.value)

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && <p className="text-text-muted">No projects added yet.</p>}
      {items.map((item, index) => (
        <ArrayEntryCard
          key={item.id}
          title={`Project ${index + 1}`}
          onRemove={() => form.removeItem("projects", item.id)}
        >
          <FormField
            id={`projects-${item.id}-name`}
            label="Project name"
            required
            error={errorFor(item, "name")}
          >
            {(field) => (
              <Input
                {...field}
                maxLength={LIMITS.projectName}
                value={item.name}
                onChange={set(item, "name")}
              />
            )}
          </FormField>
          <FormField
            id={`projects-${item.id}-description`}
            label="Description"
            required
            error={errorFor(item, "description")}
          >
            {(field) => (
              <Textarea
                {...field}
                showCounter
                maxLength={LIMITS.projectDescription}
                value={item.description}
                onChange={set(item, "description")}
              />
            )}
          </FormField>
          <TagInput
            id={`projects-${item.id}-tech`}
            label="Tech stack"
            required
            placeholder="Type a technology and press Enter"
            tags={item.tech}
            error={errorFor(item, "tech")}
            onAdd={(tag) => form.addTech(item.id, tag)}
            onRemove={(tagIndex) => form.removeTech(item.id, tagIndex)}
          />
          <FormField id={`projects-${item.id}-link`} label="Link" error={errorFor(item, "link")}>
            {(field) => (
              <Input
                {...field}
                type="url"
                inputMode="url"
                placeholder="https://"
                maxLength={LIMITS.link}
                value={item.link}
                onChange={set(item, "link")}
              />
            )}
          </FormField>
        </ArrayEntryCard>
      ))}
      <div>
        <Button variant="secondary" icon={Plus} onClick={add}>
          Add project
        </Button>
      </div>
    </div>
  )
}
