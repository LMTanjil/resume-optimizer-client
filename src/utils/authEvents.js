// Minimal pub/sub so api.js (outside React) can signal session expiry.
// See docs/error-handling.md §4.
const listeners = new Set()

export function onSessionExpired(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function emitSessionExpired() {
  listeners.forEach((fn) => {
    try {
      fn()
    } catch (error) {
      console.error(error)
    }
  })
}
