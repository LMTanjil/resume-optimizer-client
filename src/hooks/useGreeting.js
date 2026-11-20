import { useCallback } from "react"
import { GREETINGS, TIME_SUB_BANDS } from "../constants"

// Welcome toast text: holiday → weekend → time sub-band (docs/greeting-messages.md).

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher). Returns { month: 1-12, day }.
function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

function holidayKey(now) {
  const month = now.getMonth() + 1
  const day = now.getDate()
  if (month === 1 && day === 1) return "newYear"
  if (month === 12 && day === 25) return "christmas"
  const easter = easterSunday(now.getFullYear())
  if (month === easter.month && day === easter.day) return "easter"
  return null
}

function subBandKey(hour) {
  const band = TIME_SUB_BANDS.find(({ start, end }) =>
    start < end ? hour >= start && hour < end : hour >= start || hour < end
  )
  return band?.key ?? "night"
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function getGreeting(mode, name, now = new Date()) {
  const holiday = holidayKey(now)
  const day = now.getDay()
  let bucket
  if (holiday) bucket = GREETINGS.holiday[holiday]
  else if (day === 0 || day === 6) bucket = GREETINGS.weekend
  else bucket = GREETINGS.time[subBandKey(now.getHours())]
  return pickRandom(bucket[mode]).replaceAll("{name}", name || "there")
}

export function useGreeting() {
  return useCallback((mode, name, now) => getGreeting(mode, name, now), [])
}
