import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { STORAGE_KEYS } from "../../constants"
import Button from "../ui/Button"

// Theme state lives here (docs/state-management.md §4). The initial class is set in index.html.
function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.theme)
  } catch {
    return null
  }
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"))

  // Follow the OS live while the user hasn't chosen a theme.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (event) => {
      if (readStoredTheme()) return
      document.documentElement.classList.toggle("dark", event.matches)
      setIsDark(event.matches)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const toggle = () => {
    const next = !isDark
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem(STORAGE_KEYS.theme, next ? "dark" : "light")
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setIsDark(next)
  }

  return (
    <Button
      variant="ghost"
      iconOnly
      icon={isDark ? Sun : Moon}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    />
  )
}
