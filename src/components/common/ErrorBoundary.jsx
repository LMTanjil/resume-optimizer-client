import { AlertCircle } from "lucide-react"
import { Component } from "react"

// Root crash fallback (docs/error-handling.md §5). Plain markup — it must not depend on
// the router or auth context, which may be what crashed.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-4 text-center">
        <AlertCircle size={40} className="text-warning" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-text">Something went wrong.</h1>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Reload
        </button>
      </main>
    )
  }
}
