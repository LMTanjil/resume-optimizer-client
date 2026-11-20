// Central constants — limits, messages, storage keys, steps, greetings.
// See docs/non-functional-requirements.md §6 and docs/greeting-messages.md.

export const APP_NAME = "ResumeAI"

export const API_TIMEOUT_MS = 10_000
export const ANALYZE_TIMEOUT_MS = 30_000
export const ANALYZE_SLOW_AFTER_MS = 10_000
export const IMPORT_TIMEOUT_MS = 30_000

// Resume import (Contact step) — docs/api-contracts.md §4.4.
export const IMPORT_EXTENSIONS = [".pdf", ".docx", ".md"]
export const IMPORT_MAX_MB = 5

export const STORAGE_KEYS = {
  token: "token",
  user: "user",
  theme: "theme",
  drafts: (userId) => `drafts:${userId}`,
  draftsBannerDismissedAt: (userId) => `draftsBannerDismissedAt:${userId}`,
  sidebarCollapsed: "sidebar_collapsed",
}

// Public site (landing, legal pages). Placeholder contact — replace before launch.
export const CONTACT_EMAIL = "support@resumeai.example"
export const LEGAL_LAST_UPDATED = "November 17, 2026"

// Window event fired by the Navbar when "New Resume" is clicked while already on /resume/new.
export const NEW_RESUME_EVENT = "resumeai:new-resume"

// Window event fired whenever drafts are written, so every useDrafts instance (e.g. the sidebar
// badge and the Drafts page) re-reads them.
export const DRAFTS_CHANGED_EVENT = "resumeai:drafts-changed"

// Profile avatar colors (WCAG AA pairs), picked by hashing the user's email.
export const AVATAR_COLORS = [
  { bg: "#1565C0", text: "#FFFFFF" }, // blue
  { bg: "#2E7D32", text: "#FFFFFF" }, // green
  { bg: "#6A1B9A", text: "#FFFFFF" }, // purple
  { bg: "#E65100", text: "#FFFFFF" }, // orange
  { bg: "#00695C", text: "#FFFFFF" }, // teal
  { bg: "#AD1457", text: "#FFFFFF" }, // pink
  { bg: "#4527A0", text: "#FFFFFF" }, // deep purple
  { bg: "#283593", text: "#FFFFFF" }, // indigo
]

// id of the app sidebar, referenced by the navbar hamburger and the collapse toggle.
export const SIDEBAR_ID = "app-sidebar"

export const MAX_DRAFTS = 10
export const DRAFT_TTL_DAYS = 30
export const HISTORY_LIMIT = 5
export const RELATIVE_DATE_MAX_DAYS = 30

export const LIMITS = {
  userName: 100,
  userNameMin: 2,
  passwordMin: 6,
  email: 254,
  contactName: 100,
  phone: 30,
  location: 100,
  profileUrl: 200,
  title: 100,
  summary: 500,
  company: 100,
  role: 100,
  duration: 50,
  bullet: 200,
  institution: 100,
  degree: 100,
  year: 50,
  tag: 50,
  projectName: 100,
  projectDescription: 500,
  link: 2048,
  jobDescriptionMin: 50,
  jobDescription: 5000,
}

export const STEPS = [
  { id: 1, key: "contact", label: "Contact Details" },
  { id: 2, key: "basic", label: "Basic Info" },
  { id: 3, key: "experience", label: "Experience" },
  { id: 4, key: "education", label: "Education" },
  { id: 5, key: "skills", label: "Skills" },
  { id: 6, key: "projects", label: "Projects" },
]

export const TOAST_DURATION_MS = 4000

export const TOAST_MESSAGES = {
  sessionExpired: "Session expired. Please log in again.",
  timeout: "The request timed out. Please try again.",
  network: "Unable to reach the server. Please check your connection.",
  generic: "Something went wrong. Please try again.",
  loggedOut: "You've been logged out.",
  resumeSaved: "Resume saved successfully.",
  resumeDeleted: "Resume deleted.",
  resumeNotFound: "Resume not found.",
  resumeGone: "Resume no longer exists.",
  draftDiscarded: "Draft discarded.",
  completeRequired: "Please complete all required fields",
  pdfFailed: "Couldn't generate the PDF. Please try again.",
  resumeImported: "Resume imported — review and edit your details",
  importEmpty: "We couldn't find any resume details in that file.",
  comingSoon: "Coming soon",
}

export const VALIDATION_MESSAGES = {
  required: (field) => `${field} is required`,
  email: "Enter a valid email address",
  nameMin: `Name must be at least ${LIMITS.userNameMin} characters`,
  nameMax: `Name must be at most ${LIMITS.userName} characters`,
  passwordMin: `Password must be at least ${LIMITS.passwordMin} characters`,
  passwordMismatch: "Passwords do not match",
  url: "Enter a valid URL starting with http:// or https://",
  profileLink: "Enter a valid link, e.g. github.com/your-username",
  techRequired: "Add at least one technology",
  duplicateTag: (tag) => `“${tag}” is already added`,
  importType: "Choose a PDF, DOCX or Markdown (.md) file",
  importEmptyFile: "That file is empty",
  importTooLarge: `Files must be ${IMPORT_MAX_MB} MB or smaller`,
}

// Welcome greetings — docs/greeting-messages.md. `{name}` is replaced with the display name.
export const TIME_SUB_BANDS = [
  { key: "earlyMorning", start: 5, end: 7 },
  { key: "morning", start: 7, end: 9 },
  { key: "midMorning", start: 9, end: 11 },
  { key: "lateMorning", start: 11, end: 12 },
  { key: "midday", start: 12, end: 13 },
  { key: "afternoon", start: 13, end: 15 },
  { key: "lateAfternoon", start: 15, end: 17 },
  { key: "earlyEvening", start: 17, end: 18 },
  { key: "evening", start: 18, end: 20 },
  { key: "lateEvening", start: 20, end: 21 },
  { key: "night", start: 21, end: 23 },
  { key: "midnight", start: 23, end: 1 },
  { key: "smallHours", start: 1, end: 5 },
]

export const GREETINGS = {
  holiday: {
    newYear: {
      login: [
        "Happy New Year, {name}! 🎆 New year, new resume?",
        "Welcome back, {name}! Let's make this year's first move a great one.",
      ],
      register: [
        "Happy New Year, {name}! 🎆 What a day to start fresh with ResumeAI.",
        "Welcome, {name}! New year, new goals. Let's build the resume to match.",
      ],
    },
    easter: {
      login: [
        "Happy Easter, {name}! 🐣 Thanks for stopping by.",
        "Welcome back, {name}! Hope your Easter is a bright one.",
      ],
      register: [
        "Happy Easter, {name}! 🐣 Welcome to ResumeAI.",
        "Welcome, {name}! A fresh start on a fresh-start kind of day.",
      ],
    },
    christmas: {
      login: [
        "Merry Christmas, {name}! 🎄 Good to see you.",
        "Welcome back, {name}! A little career gift to yourself today?",
      ],
      register: [
        "Merry Christmas, {name}! 🎄 Welcome to ResumeAI.",
        "Welcome, {name}! Here's to next year's dream job.",
      ],
    },
  },
  weekend: {
    login: [
      "Happy weekend, {name}! A relaxed day for a resume refresh.",
      "Welcome back, {name}! Weekend hustle, respect. 💪",
      "Hey {name}, no rush today. Polish at your own pace.",
    ],
    register: [
      "Welcome, {name}! A weekend start, nice and unhurried.",
      "Welcome aboard, {name}! Great weekend project: your next career move.",
      "Hi {name}! Glad you're here. Let's build something great this weekend.",
    ],
  },
  time: {
    earlyMorning: {
      login: [
        "Up with the sun, {name}? ☀️ Welcome back.",
        "Good early morning, {name}. The quiet hours are the best for focus.",
      ],
      register: [
        "Early start, {name}! Welcome to ResumeAI.",
        "Welcome, {name}! An early-bird start to your new resume.",
      ],
    },
    morning: {
      login: [
        "Good morning, {name}! ☕ Ready to get to work?",
        "Morning, {name}! Fresh coffee, fresh ideas.",
      ],
      register: [
        "Good morning, {name}! Welcome to ResumeAI.",
        "Morning, {name}! Great way to start the day. Welcome aboard.",
      ],
    },
    midMorning: {
      login: [
        "Welcome back, {name}! The morning's in full swing.",
        "Hey {name}, good to see you this morning.",
      ],
      register: [
        "Welcome, {name}! Let's make this morning count.",
        "Hi {name}! Your resume journey starts now.",
      ],
    },
    lateMorning: {
      login: [
        "Almost lunchtime, {name}. Let's squeeze in some progress.",
        "Welcome back, {name}! Perfect timing before the lunch break.",
      ],
      register: [
        "Welcome, {name}! A great late-morning start.",
        "Hi {name}! Glad you joined before lunch.",
      ],
    },
    midday: {
      login: [
        "Lunch-break hustle, {name}? 🥪 Welcome back.",
        "Good afternoon, {name}! Midday check-in.",
      ],
      register: [
        "Welcome, {name}! Lunch break well spent.",
        "Hi {name}! A midday start. Let's get going.",
      ],
    },
    afternoon: {
      login: [
        "Good afternoon, {name}! Let's keep the momentum.",
        "Welcome back, {name}! Afternoon focus mode: on.",
      ],
      register: [
        "Good afternoon, {name}! Welcome to ResumeAI.",
        "Welcome aboard, {name}! Let's build something great this afternoon.",
      ],
    },
    lateAfternoon: {
      login: [
        "Welcome back, {name}! A late-afternoon push.",
        "Hey {name}, the home stretch of the day. Let's make it count.",
      ],
      register: [
        "Welcome, {name}! A strong finish to the afternoon.",
        "Hi {name}! Perfect time to start something new.",
      ],
    },
    earlyEvening: {
      login: [
        "Good evening, {name}! Wrapping up the day?",
        "Welcome back, {name}! Workday's winding down. Time for you.",
      ],
      register: [
        "Good evening, {name}! Welcome to ResumeAI.",
        "Welcome, {name}! A great way to end the workday.",
      ],
    },
    evening: {
      login: [
        "Good evening, {name}! 🌆 Let's pick up where you left off.",
        "Evening, {name}! A calm time for career moves.",
      ],
      register: [
        "Good evening, {name}! Glad you're here.",
        "Welcome aboard, {name}! Evening ambition. We like it.",
      ],
    },
    lateEvening: {
      login: [
        "Welcome back, {name}! Settling in for the evening?",
        "Hey {name}, a little evening polish goes a long way.",
      ],
      register: [
        "Welcome, {name}! A cozy evening start.",
        "Hi {name}! Let's make tonight productive.",
      ],
    },
    night: {
      login: [
        "Night-owl mode, {name}? 🌙 Welcome back.",
        "Welcome back, {name}! The quiet of the night is perfect for focus.",
      ],
      register: [
        "Welcome, {name}! Night-time focus, let's do this. 🌙",
        "Hi {name}! A late start is still a great start.",
      ],
    },
    midnight: {
      login: [
        "Burning the midnight oil, {name}? 🕯️",
        "Welcome back, {name}! Midnight edits hit different.",
      ],
      register: [
        "Welcome, {name}! Midnight inspiration struck?",
        "Hi {name}! Big plans at midnight. Love it.",
      ],
    },
    smallHours: {
      login: [
        "Still up, {name}? Welcome back, and don't forget to rest. 💤",
        "Hey {name}, small-hours grind. Let's keep it quick.",
      ],
      register: [
        "Welcome, {name}! Late night or early morning, we're glad you're here.",
        "Hi {name}! The world's asleep. Perfect time to plan your next move.",
      ],
    },
  },
}
