import axios from "axios"
import { TOAST_MESSAGES } from "../constants"

// Maps any axios error to the message rules in docs/error-handling.md §1.
export function getErrorMessage(error) {
  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") return TOAST_MESSAGES.timeout
  if (!error?.response) return TOAST_MESSAGES.network
  const message = error.response.data?.error
  return typeof message === "string" && message.trim() ? message : TOAST_MESSAGES.generic
}

export function isNotFound(error) {
  const status = error?.response?.status
  return status === 404 || status === 403
}

export function isCanceled(error) {
  return axios.isCancel(error) || error?.code === "ERR_CANCELED"
}

// False for session-expired (handled globally) and canceled requests.
export function shouldShowError(error) {
  return !error?.isSessionExpired && !isCanceled(error)
}
