import { Font } from "@react-pdf/renderer"

// Shared helpers for the react-pdf resume templates (Classic, Modern, Minimal).
// Every helper tolerates missing or malformed fields, so older resumes still render.

// Don't hyphenate ordinary words ("develop-ment"). Very long tokens (URLs, emails) are split into
// chunks so they can still wrap instead of running out of a narrow column.
Font.registerHyphenationCallback((word) => (word.length > 24 ? word.match(/.{1,16}/g) : [word]))

// A4 with 40pt top/bottom and 48pt left/right margins.
export const PAGE_SIZE = "A4"
export const MARGIN = { vertical: 40, horizontal: 48 }

// Returns a display-safe string, never undefined/null.
export const safe = (val) => (typeof val === "string" && val.trim() ? val.trim() : "")

const list = (val) => (Array.isArray(val) ? val : [])

// "https://www.linkedin.com/in/jane/" -> "linkedin.com/in/jane"
export const displayUrl = (url) =>
  safe(url)
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "")

// Full URL for a <Link>. Older resumes may hold links saved without a scheme.
export const hrefFor = (url) => {
  const text = safe(url)
  if (!text) return ""
  return /^https?:\/\//i.test(text) ? text : `https://${text.replace(/^\/+/, "")}`
}

const CONTACT_LABELS = {
  email: "Email",
  phone: "Phone",
  location: "Location",
  linkedin: "LinkedIn",
  github: "GitHub",
  website: "Website",
}
const LINK_KEYS = ["linkedin", "github", "website"]
export const CONTACT_KEYS = Object.keys(CONTACT_LABELS)

// Non-empty contact fields (name excluded) as { key, label, text, href }.
// text is what's printed (links shortened), href is set for email and web links.
export function contactItems(contact, keys = CONTACT_KEYS) {
  const source = contact && typeof contact === "object" ? contact : {}
  return keys
    .map((key) => {
      const value = safe(source[key])
      if (!value) return null
      if (LINK_KEYS.includes(key)) {
        return { key, label: CONTACT_LABELS[key], text: displayUrl(value), href: hrefFor(value) }
      }
      const href = key === "email" ? `mailto:${value}` : ""
      return { key, label: CONTACT_LABELS[key], text: value, href }
    })
    .filter(Boolean)
}

// Joins contact fields with " · ", skipping empty ones.
export const contactLine = (contact, keys = CONTACT_KEYS) =>
  contactItems(contact, keys)
    .map((item) => item.text)
    .join(" · ")

// Experience bullets as an array of non-empty strings.
export const getBullets = (exp) => list(exp?.bullets).map(safe).filter(Boolean)

// The resume content with every section normalized to safe strings and arrays.
// Entries with nothing to show are dropped so a template never prints an empty block.
export function normalizeResume(content) {
  const source = content && typeof content === "object" ? content : {}
  const contact = source.contact && typeof source.contact === "object" ? source.contact : {}

  const experience = list(source.experience)
    .map((item) => ({
      company: safe(item?.company),
      role: safe(item?.role),
      duration: safe(item?.duration),
      bullets: getBullets(item),
    }))
    .filter((item) => item.company || item.role || item.duration || item.bullets.length)

  const education = list(source.education)
    .map((item) => ({
      institution: safe(item?.institution),
      degree: safe(item?.degree),
      year: safe(item?.year),
    }))
    .filter((item) => item.institution || item.degree || item.year)

  const projects = list(source.projects)
    .map((item) => ({
      name: safe(item?.name),
      description: safe(item?.description),
      tech: list(item?.tech).map(safe).filter(Boolean),
      link: safe(item?.link),
    }))
    .filter((item) => item.name || item.description || item.tech.length || item.link)

  return {
    name: safe(contact.name),
    contact,
    summary: safe(source.summary),
    experience,
    education,
    skills: list(source.skills).map(safe).filter(Boolean),
    projects,
  }
}

// Headline under the name in the Modern sidebar: the most recent job role. Experience is entered
// newest first in the builder, so that's the first entry with a role.
export const latestRole = (experience) => experience.find((item) => item.role)?.role ?? ""

// "Brightline · 2022 – Present" style meta line from the non-empty parts.
export const joinParts = (...parts) => parts.filter(Boolean).join(" · ")
