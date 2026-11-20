import { formatIsoDay } from "./dateUtils"
import { CONTACT_FIELDS, normalizeContent, slugify } from "./resumeData"

// Clean text-only PDF: resume sections, then the analysis (docs/functional-requirements.md FR-AN-06).
// jsPDF is imported on demand so it never lands in the main bundle.

const PAGE = { margin: 48, lineGap: 4 }
const FONT = { name: 20, heading: 13, body: 10.5, meta: 9.5 }

export async function exportPdf(resume, analysis) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PAGE.margin * 2
  let y = PAGE.margin

  const ensureSpace = (height) => {
    if (y + height > pageHeight - PAGE.margin) {
      doc.addPage()
      y = PAGE.margin
    }
  }

  const write = (text, { size = FONT.body, bold = false, indent = 0, gapAfter = 2 } = {}) => {
    if (!text) return
    doc.setFont("helvetica", bold ? "bold" : "normal")
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(String(text), contentWidth - indent)
    const lineHeight = size + PAGE.lineGap
    lines.forEach((line) => {
      ensureSpace(lineHeight)
      doc.text(line, PAGE.margin + indent, y + size)
      y += lineHeight
    })
    y += gapAfter
  }

  const heading = (text) => {
    ensureSpace(FONT.heading + 24)
    y += 10
    write(text.toUpperCase(), { size: FONT.heading, bold: true, gapAfter: 0 })
    doc.setDrawColor(200)
    doc.line(PAGE.margin, y, pageWidth - PAGE.margin, y)
    y += 8
  }

  // normalizeContent fills missing keys, so content.contact is always an object even when the
  // API returned no contact (all fields are then "").
  const content = normalizeContent(resume?.content)
  const { contact } = content

  // 1. Resume title
  write(resume?.title || contact.name || "Resume", { size: FONT.name, bold: true, gapAfter: 4 })

  // 2. Contact details: name | email | phone | location | linkedin | github | website,
  // non-empty fields only; no line if none. Links drop "https://" and "www." to stay short.
  const shortUrl = (value) =>
    value
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/$/, "")
  const contactLine = CONTACT_FIELDS.map((key) => {
    const value = contact[key].trim()
    return ["linkedin", "github", "website"].includes(key) ? shortUrl(value) : value
  })
    .filter(Boolean)
    .join(" | ")
  if (contactLine) write(contactLine, { size: FONT.meta })

  if (content.summary) {
    heading("Summary")
    write(content.summary)
  }

  if (content.experience.length) {
    heading("Experience")
    content.experience.forEach((item) => {
      write(`${item.role} — ${item.company}`, { bold: true, gapAfter: 0 })
      write(item.duration, { size: FONT.meta })
      item.bullets.forEach((bullet) => write(`•  ${bullet}`, { indent: 10, gapAfter: 0 }))
      y += 6
    })
  }

  if (content.education.length) {
    heading("Education")
    content.education.forEach((item) => {
      write(item.degree, { bold: true, gapAfter: 0 })
      write([item.institution, item.year].filter(Boolean).join(", "), { gapAfter: 6 })
    })
  }

  if (content.skills.length) {
    heading("Skills")
    write(content.skills.join(", "))
  }

  if (content.projects.length) {
    heading("Projects")
    content.projects.forEach((item) => {
      write(item.name, { bold: true, gapAfter: 0 })
      write(item.description, { gapAfter: 0 })
      if (item.tech.length) {
        // Wrap the joined tech list to the content width, then advance y by the wrapped lines.
        doc.setFont("helvetica", "normal")
        doc.setFontSize(FONT.meta)
        const techLines = doc.splitTextToSize(`Tech: ${item.tech.join(", ")}`, contentWidth)
        const lineHeight = FONT.meta + PAGE.lineGap
        techLines.forEach((line) => {
          ensureSpace(lineHeight)
          doc.text(line, PAGE.margin, y + FONT.meta)
          y += lineHeight
        })
      }
      if (item.link) write(item.link, { size: FONT.meta, gapAfter: 0 })
      y += 6
    })
  }

  if (analysis) {
    // 8. Divider between the resume and the analysis
    ensureSpace(40)
    y += 16
    doc.setDrawColor(120)
    doc.setLineWidth(1.5)
    doc.line(PAGE.margin, y, pageWidth - PAGE.margin, y)
    doc.setLineWidth(0.5)
    y += 8

    // 9. Analysis results
    heading("Analysis")
    write(`Date: ${formatIsoDay(analysis.created_at)}`, { size: FONT.meta })
    write(`Match score: ${analysis.match_score}%`, { bold: true, gapAfter: 6 })

    const list = (title, items, numbered = false) => {
      write(title, { bold: true, gapAfter: 0 })
      if (!items?.length) {
        write("None", { indent: 10, gapAfter: 6 })
        return
      }
      if (numbered) {
        items.forEach((item, i) => write(`${i + 1}.  ${item}`, { indent: 10, gapAfter: 0 }))
        y += 6
      } else {
        write(items.join(", "), { indent: 10, gapAfter: 6 })
      }
    }
    list("Missing keywords", analysis.missing_keywords)
    list("Strengths", analysis.strengths)
    list("Suggestions", analysis.suggestions, true)
  }

  const date = formatIsoDay(analysis?.created_at)
  doc.save(`${slugify(resume?.title)}-analysis-${date}.pdf`)
}
