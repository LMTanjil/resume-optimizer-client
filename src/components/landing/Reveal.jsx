import { useInView } from "../../hooks/useInView"

// Fades its content up into place the first time it scrolls into view (600ms, ease-out).
// With prefers-reduced-motion, the content is simply shown: no fade, no movement.
export default function Reveal({ as: Tag = "div", className = "", children }) {
  const [ref, isInView] = useInView()
  const state = isInView
    ? "translate-y-0 opacity-100"
    : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"

  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none ${state} ${className}`}
    >
      {children}
    </Tag>
  )
}
