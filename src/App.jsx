import { Toaster } from "react-hot-toast"
import { RouterProvider } from "react-router-dom"
import { TOAST_DURATION_MS } from "./constants"
import { router } from "./router"

const toastStyle = {
  background: "rgb(var(--color-surface))",
  color: "rgb(var(--color-text))",
  border: "1px solid rgb(var(--color-border))",
  borderRadius: "0.5rem",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.12)",
  fontSize: "0.9375rem",
  maxWidth: "28rem",
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: TOAST_DURATION_MS,
          style: toastStyle,
          success: { iconTheme: { primary: "rgb(var(--color-success))", secondary: "#fff" } },
          error: { iconTheme: { primary: "rgb(var(--color-warning))", secondary: "#fff" } },
        }}
      />
    </>
  )
}
