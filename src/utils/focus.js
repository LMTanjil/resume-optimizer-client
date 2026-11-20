// Focuses an element after React has rendered it (used after adding entries/bullets).
export function focusSoon(id) {
  requestAnimationFrame(() => document.getElementById(id)?.focus())
}
