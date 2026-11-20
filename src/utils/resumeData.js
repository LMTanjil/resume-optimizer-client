// Conversions between the API resume shape and the builder's internal form shape.
// The internal shape adds client-only ids for stable React keys (docs/state-management.md §5).

export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const str = (value) => (typeof value === "string" ? value : "")
const arr = (value) => (Array.isArray(value) ? value : [])
const trim = (value) => str(value).trim()

export const emptyExperience = () => ({
  id: newId(),
  company: "",
  role: "",
  duration: "",
  bullets: [],
})
export const emptyEducation = () => ({ id: newId(), institution: "", degree: "", year: "" })
export const emptyProject = () => ({ id: newId(), name: "", description: "", tech: [], link: "" })
export const emptyBullet = () => ({ id: newId(), text: "" })

// Fills any missing keys so older resumes (without contact) still load.
export function normalizeContent(content) {
  const source = content && typeof content === "object" ? content : {}
  const contact = source.contact ?? {}
  return {
    contact: {
      name: str(contact.name),
      email: str(contact.email),
      phone: str(contact.phone),
      location: str(contact.location),
    },
    summary: str(source.summary),
    experience: arr(source.experience).map((item) => ({
      company: str(item?.company),
      role: str(item?.role),
      duration: str(item?.duration),
      bullets: arr(item?.bullets).filter((b) => typeof b === "string"),
    })),
    education: arr(source.education).map((item) => ({
      institution: str(item?.institution),
      degree: str(item?.degree),
      year: str(item?.year),
    })),
    skills: arr(source.skills).filter((s) => typeof s === "string"),
    projects: arr(source.projects).map((item) => ({
      name: str(item?.name),
      description: str(item?.description),
      tech: arr(item?.tech).filter((t) => typeof t === "string"),
      link: str(item?.link),
    })),
  }
}

// API or draft payload { title, content } → internal form data.
export function toFormData({ title, content } = {}) {
  const normalized = normalizeContent(content)
  return {
    title: str(title),
    content: {
      ...normalized,
      experience: normalized.experience.map((item) => ({
        ...item,
        id: newId(),
        bullets: item.bullets.map((text) => ({ id: newId(), text })),
      })),
      education: normalized.education.map((item) => ({ ...item, id: newId() })),
      projects: normalized.projects.map((item) => ({ ...item, id: newId() })),
    },
  }
}

export function emptyFormData(prefillName = "") {
  return toFormData({ title: "", content: { contact: { name: prefillName } } })
}

// Internal form data → API payload: strip ids, trim strings, drop empty bullets.
export function toPayload(data) {
  const { content } = data
  return {
    title: trim(data.title),
    content: {
      contact: {
        name: trim(content.contact.name),
        email: trim(content.contact.email),
        phone: trim(content.contact.phone),
        location: trim(content.contact.location),
      },
      summary: trim(content.summary),
      experience: content.experience.map((item) => ({
        company: trim(item.company),
        role: trim(item.role),
        duration: trim(item.duration),
        bullets: item.bullets.map((b) => trim(b.text)).filter(Boolean),
      })),
      education: content.education.map((item) => ({
        institution: trim(item.institution),
        degree: trim(item.degree),
        year: trim(item.year),
      })),
      skills: content.skills.map(trim).filter(Boolean),
      projects: content.projects.map((item) => ({
        name: trim(item.name),
        description: trim(item.description),
        tech: item.tech.map(trim).filter(Boolean),
        link: trim(item.link),
      })),
    },
  }
}

// Import response → form data, merged over the current form.
// Accepts { title?, content } or a bare content object. A value found in the file wins;
// anything the file didn't provide (empty string or empty list) keeps the current value,
// so e.g. the prefilled contact name survives an import that has no name.
export function mergeImported(current, response) {
  const source = response && typeof response === "object" ? response : {}
  const content = source.content && typeof source.content === "object" ? source.content : source
  const imported = toFormData({ title: source.title, content })
  const pick = (next, prev) => (next.trim() ? next.trim() : prev)
  const pickList = (next, prev) => (next.length ? next : prev)

  const seen = new Set()
  const skills = imported.content.skills
    .map((skill) => skill.trim())
    .filter((skill) => {
      const key = skill.toLowerCase()
      if (!skill || seen.has(key)) return false
      seen.add(key)
      return true
    })

  const contact = {}
  Object.keys(current.content.contact).forEach((key) => {
    contact[key] = pick(imported.content.contact[key] ?? "", current.content.contact[key])
  })

  return {
    title: pick(imported.title, current.title),
    content: {
      contact,
      summary: pick(imported.content.summary, current.content.summary),
      experience: pickList(imported.content.experience, current.content.experience),
      education: pickList(imported.content.education, current.content.education),
      skills: pickList(skills, current.content.skills),
      projects: pickList(imported.content.projects, current.content.projects),
    },
  }
}

// Untrimmed, id-free snapshot used for the dirty check.
export function snapshot(data) {
  const { content } = data
  return JSON.stringify({
    title: data.title,
    contact: content.contact,
    summary: content.summary,
    experience: content.experience.map((item) => [
      item.company,
      item.role,
      item.duration,
      item.bullets.map((b) => b.text),
    ]),
    education: content.education.map((item) => [item.institution, item.degree, item.year]),
    skills: content.skills,
    projects: content.projects.map((item) => [item.name, item.description, item.tech, item.link]),
  })
}

// Slug for the PDF filename.
export function slugify(value) {
  const slug = str(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "resume"
}
