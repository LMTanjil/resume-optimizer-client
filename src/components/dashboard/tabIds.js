// Tab order: Overview | My Resumes | Drafts. The key is also the ?tab= value.
export const DASHBOARD_TABS = [
  { key: "overview", label: "Overview" },
  { key: "resumes", label: "My Resumes" },
  { key: "drafts", label: "Drafts" },
]

export const tabId = (key) => `tab-${key}`
export const panelId = (key) => `panel-${key}`
