// Display name for greetings and UI: user.name, or the email prefix for older accounts.
export function getDisplayName(user) {
  if (!user) return ""
  if (typeof user.name === "string" && user.name.trim()) return user.name.trim()
  return String(user.email ?? "").split("@")[0]
}
