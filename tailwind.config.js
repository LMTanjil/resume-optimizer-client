/** Color values live as CSS variables in src/index.css (see docs/design.md §1). */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: {
          DEFAULT: "rgb(var(--color-text) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
        },
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          tint: "var(--color-warning-tint)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          tint: "var(--color-success-tint)",
        },
        amber: "rgb(var(--color-amber) / <alpha-value>)",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      maxWidth: { content: "1280px" },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        modalIn: {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "modal-in": "modalIn 150ms ease-out",
      },
    },
  },
  plugins: [],
}
