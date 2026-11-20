import { Plus } from "lucide-react"
import { useRef, useState } from "react"
import { LIMITS, VALIDATION_MESSAGES } from "../../constants"
import { hasTag } from "../../utils/validation"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Tag from "../ui/Tag"

// Used for Skills and Project tech (docs/functional-requirements.md FR-BLD-08).
export default function TagInput({
  id,
  label,
  tags,
  onAdd,
  onRemove,
  error,
  required = false,
  placeholder,
}) {
  const inputRef = useRef(null)
  const [value, setValue] = useState("")
  const [localError, setLocalError] = useState("")

  const shownError = localError || error
  const errorId = shownError ? `${id}-error` : undefined

  const add = () => {
    const tag = value.trim()
    if (!tag) return
    if (hasTag(tags, tag)) {
      setLocalError(VALIDATION_MESSAGES.duplicateTag(tag))
      return
    }
    onAdd(tag)
    setValue("")
    setLocalError("")
  }

  const remove = (index) => {
    onRemove(index)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-warning">
            *
          </span>
        )}
      </label>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          maxLength={LIMITS.tag}
          placeholder={placeholder}
          invalid={Boolean(shownError)}
          aria-describedby={errorId}
          aria-required={required || undefined}
          onChange={(event) => {
            setValue(event.target.value)
            if (localError) setLocalError("")
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              add()
            }
          }}
        />
        <Button variant="secondary" icon={Plus} onClick={add}>
          Add
        </Button>
      </div>
      {shownError && (
        <p id={errorId} className="text-sm text-warning">
          {shownError}
        </p>
      )}
      {tags.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-2" aria-label={label}>
          {tags.map((tag, index) => (
            <li key={`${tag}-${index}`}>
              <Tag onRemove={() => remove(index)}>{tag}</Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
