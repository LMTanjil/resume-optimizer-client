import { LIMITS } from "../../../constants"
import FormField from "../../ui/FormField"
import Input from "../../ui/Input"
import ImportResumeButton from "../ImportResumeButton"

const FIELDS = [
  {
    key: "name",
    label: "Full name",
    required: true,
    max: LIMITS.contactName,
    autoComplete: "name",
  },
  {
    key: "email",
    label: "Email",
    required: true,
    max: LIMITS.email,
    type: "email",
    autoComplete: "email",
  },
  { key: "phone", label: "Phone", max: LIMITS.phone, type: "tel", autoComplete: "tel" },
  { key: "location", label: "Location", max: LIMITS.location, placeholder: "City, Country" },
  {
    key: "linkedin",
    label: "LinkedIn",
    max: LIMITS.profileUrl,
    type: "url",
    autoComplete: "url",
    placeholder: "linkedin.com/in/your-name",
  },
  {
    key: "github",
    label: "GitHub",
    max: LIMITS.profileUrl,
    type: "url",
    autoComplete: "url",
    placeholder: "github.com/your-username",
  },
  {
    key: "website",
    label: "Website",
    max: LIMITS.profileUrl,
    type: "url",
    autoComplete: "url",
    placeholder: "your-site.com",
  },
]

export default function ContactStep({ form, importer }) {
  const { contact } = form.data.content
  return (
    <>
      {importer && <ImportResumeButton importing={importer.importing} onFile={importer.onFile} />}
      <fieldset
        disabled={importer?.importing}
        className="m-0 grid min-w-0 gap-4 border-0 p-0 md:grid-cols-2"
      >
        {FIELDS.map(({ key, label, required, max, type = "text", autoComplete, placeholder }) => (
          <FormField
            key={key}
            id={`contact-${key}`}
            label={label}
            required={required}
            error={form.errors[`contact.${key}`]}
          >
            {(field) => (
              <Input
                {...field}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                maxLength={max}
                value={contact[key]}
                onChange={(event) => form.setContact(key, event.target.value)}
              />
            )}
          </FormField>
        ))}
      </fieldset>
    </>
  )
}
