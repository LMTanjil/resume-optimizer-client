import { LIMITS } from "../../../constants"
import FormField from "../../ui/FormField"
import Input from "../../ui/Input"
import Textarea from "../../ui/Textarea"

export default function BasicInfoStep({ form }) {
  return (
    <div className="flex flex-col gap-4">
      <FormField id="title" label="Resume title" required error={form.errors.title}>
        {(field) => (
          <Input
            {...field}
            placeholder="e.g. Frontend Developer Resume"
            maxLength={LIMITS.title}
            value={form.data.title}
            onChange={(event) => form.setTitle(event.target.value)}
          />
        )}
      </FormField>
      <FormField id="summary" label="Summary">
        {(field) => (
          <Textarea
            {...field}
            showCounter
            placeholder="A short professional summary"
            maxLength={LIMITS.summary}
            value={form.data.content.summary}
            onChange={(event) => form.setSummary(event.target.value)}
          />
        )}
      </FormField>
    </div>
  )
}
