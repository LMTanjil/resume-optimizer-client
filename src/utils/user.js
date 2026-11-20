import { AVATAR_COLORS } from "../constants"

// Display name for greetings and UI: user.name, or the email prefix for older accounts.
export function getDisplayName(user) {
  if (!user) return ""
  if (typeof user.name === "string" && user.name.trim()) return user.name.trim()
  return String(user.email ?? "").split("@")[0]
}

// First letter of user.name, or of the email when there's no name. Uppercase; "?" as a fallback.
export function getAvatarInitial(user) {
  const name = typeof user?.name === "string" ? user.name.trim() : ""
  const source = name || String(user?.email ?? "").trim()
  const first = Array.from(source)[0]
  return first ? first.toUpperCase() : "?"
}

// Deterministic avatar colors: the same email always maps to the same pair.
export function getAvatarColor(email) {
  const colors = AVATAR_COLORS
  const value = String(email ?? "")
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
