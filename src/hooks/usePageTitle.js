import { useEffect } from "react"
import { APP_NAME } from "../constants"

// Sets document.title to "{Page} · ResumeAI".
export function usePageTitle(page) {
  useEffect(() => {
    document.title = page ? `${page} · ${APP_NAME}` : APP_NAME
  }, [page])
}
