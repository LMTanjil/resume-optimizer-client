import {
  IMPORT_EXTENSIONS,
  IMPORT_MAX_MB,
  LIMITS,
  STEPS,
  VALIDATION_MESSAGES as MSG,
} from "../constants"

// All validation rules live here — docs/error-handling.md §6.
// Builder errors are keyed by field path, e.g. "contact.email" or "experience.<itemId>.company".

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isBlank = (value) => !value || !String(value).trim()

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value).trim())
}

export function isValidHttpUrl(value) {
  try {
    const url = new URL(String(value).trim())
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname)
  } catch {
    return false
  }
}

// ---------- Auth forms ----------

export function validateLogin({ email, password }) {
  const errors = {}
  if (isBlank(email)) errors.email = MSG.required("Email")
  else if (!isValidEmail(email)) errors.email = MSG.email
  if (!password) errors.password = MSG.required("Password")
  else if (password.length < LIMITS.passwordMin) errors.password = MSG.passwordMin
  return errors
}

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {}
  if (isBlank(name)) errors.name = MSG.required("Name")
  else if (name.trim().length < LIMITS.userNameMin) errors.name = MSG.nameMin
  Object.assign(errors, validateLogin({ email, password }))
  if (confirmPassword !== password) errors.confirmPassword = MSG.passwordMismatch
  return errors
}

// ---------- Resume import ----------

// The file input's `accept` is only a hint, so the extension and size are checked again here.
export function validateImportFile(file) {
  const name = String(file?.name ?? "").toLowerCase()
  if (!IMPORT_EXTENSIONS.some((ext) => name.endsWith(ext))) return MSG.importType
  if (!file.size) return MSG.importEmptyFile
  if (file.size > IMPORT_MAX_MB * 1024 * 1024) return MSG.importTooLarge
  return null
}

// ---------- Resume builder ----------

const STEP_VALIDATORS = {
  contact: ({ content }) => {
    const errors = {}
    const { name, email } = content.contact
    if (isBlank(name)) errors["contact.name"] = MSG.required("Name")
    if (isBlank(email)) errors["contact.email"] = MSG.required("Email")
    else if (!isValidEmail(email)) errors["contact.email"] = MSG.email
    return errors
  },
  basic: ({ title }) => (isBlank(title) ? { title: MSG.required("Title") } : {}),
  experience: ({ content }) => {
    const errors = {}
    content.experience.forEach((item) => {
      if (isBlank(item.company)) errors[`experience.${item.id}.company`] = MSG.required("Company")
      if (isBlank(item.role)) errors[`experience.${item.id}.role`] = MSG.required("Role")
      if (isBlank(item.duration))
        errors[`experience.${item.id}.duration`] = MSG.required("Duration")
    })
    return errors
  },
  education: ({ content }) => {
    const errors = {}
    content.education.forEach((item) => {
      if (isBlank(item.institution))
        errors[`education.${item.id}.institution`] = MSG.required("Institution")
      if (isBlank(item.degree)) errors[`education.${item.id}.degree`] = MSG.required("Degree")
    })
    return errors
  },
  skills: () => ({}),
  projects: ({ content }) => {
    const errors = {}
    content.projects.forEach((item) => {
      if (isBlank(item.name)) errors[`projects.${item.id}.name`] = MSG.required("Project name")
      if (isBlank(item.description))
        errors[`projects.${item.id}.description`] = MSG.required("Description")
      if (item.tech.length === 0) errors[`projects.${item.id}.tech`] = MSG.techRequired
      if (!isBlank(item.link) && !isValidHttpUrl(item.link))
        errors[`projects.${item.id}.link`] = MSG.url
    })
    return errors
  },
}

export function validateStep(stepNumber, data) {
  const step = STEPS[stepNumber - 1]
  return step ? STEP_VALIDATORS[step.key](data) : {}
}

// Returns the first invalid step number up to `upTo` (inclusive), or null.
export function findFirstInvalidStep(data, upTo = STEPS.length) {
  for (let step = 1; step <= upTo; step += 1) {
    if (Object.keys(validateStep(step, data)).length > 0) return step
  }
  return null
}

// Case-insensitive duplicate check for tag inputs.
export function hasTag(tags, tag) {
  const needle = tag.trim().toLowerCase()
  return tags.some((existing) => existing.toLowerCase() === needle)
}
