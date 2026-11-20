// Templates offered on the preview page, in picker order. The first one is the default.
// Names only: this file is imported by the page shell, so it must not pull in @react-pdf/renderer.
// The matching components are in templateComponents.js (loaded with the lazy PDF panel).
export const PDF_TEMPLATES = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
]

export const DEFAULT_TEMPLATE_ID = PDF_TEMPLATES[0].id

export const findTemplate = (id) =>
  PDF_TEMPLATES.find((template) => template.id === id) ?? PDF_TEMPLATES[0]
