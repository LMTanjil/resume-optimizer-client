import { differenceInCalendarDays, format, formatDistanceToNow, isValid, parseISO } from "date-fns"
import { RELATIVE_DATE_MAX_DAYS } from "../constants"

function toDate(value) {
  if (value instanceof Date) return value
  return typeof value === "string" ? parseISO(value) : new Date(value)
}

// "2 days ago" within 30 days, otherwise "Nov 13, 2026".
export function formatRelativeDate(value) {
  const date = toDate(value)
  if (!isValid(date)) return ""
  if (Math.abs(differenceInCalendarDays(new Date(), date)) > RELATIVE_DATE_MAX_DAYS) {
    return format(date, "MMM d, yyyy")
  }
  return formatDistanceToNow(date, { addSuffix: true })
}

// YYYY-MM-DD in local time (PDF filename).
export function formatIsoDay(value) {
  const date = toDate(value)
  return format(isValid(date) ? date : new Date(), "yyyy-MM-dd")
}

export function daysSince(value) {
  const date = toDate(value)
  return isValid(date) ? differenceInCalendarDays(new Date(), date) : Infinity
}
