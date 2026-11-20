import { useEffect, useRef, useState } from "react"

/**
 * Returns [ref, isInView]. Attach `ref` to an element; `isInView` turns true the first time at
 * least `threshold` of it is visible, and then stays true (no re-trigger on scroll up).
 * Without IntersectionObserver support, it is true right away.
 */
export function useInView({ threshold = 0.15 } = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isInView) return undefined
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsInView(true)
        observer.disconnect()
      },
      { threshold }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [isInView, threshold])

  return [ref, isInView]
}
