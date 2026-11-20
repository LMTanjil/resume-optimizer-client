import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import {
  MARGIN,
  PAGE_SIZE,
  contactItems,
  displayUrl,
  hrefFor,
  joinParts,
  normalizeResume,
} from "./pdfUtils"
import PdfSection from "./PdfSection"

const NAME = "#1A1F2E"
const GRAY = "#888888"
const BODY = "#333333"

const s = StyleSheet.create({
  page: {
    paddingVertical: MARGIN.vertical,
    paddingHorizontal: MARGIN.horizontal,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.6,
    color: BODY,
  },
  // Helvetica (a built-in PDF font) has no light cut, so weight 300 renders as regular.
  name: {
    fontSize: 20,
    fontWeight: 300,
    letterSpacing: 3,
    color: NAME,
    textAlign: "center",
    lineHeight: 1.3,
  },
  contact: { marginTop: 6, fontSize: 8, color: GRAY, textAlign: "center" },
  contactLink: { color: GRAY, textDecoration: "none" },
  heading: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: GRAY,
  },
  paragraph: { marginBottom: 10 },
  entry: { marginBottom: 12 },
  entryTitle: { color: NAME },
  meta: { color: GRAY },
  bulletRow: { flexDirection: "row", marginTop: 3 },
  bullet: { width: 12, color: GRAY },
  bulletText: { flex: 1 },
  link: { color: GRAY, textDecoration: "none" },
})

// Minimal: single column, lots of whitespace, no rules or fills.
export default function MinimalTemplate({ content, title }) {
  const r = normalizeResume(content)
  const contact = contactItems(r.contact)

  return (
    <Document title={r.name || title} author={r.name} subject={title}>
      <Page size={PAGE_SIZE} style={s.page}>
        {r.name ? <Text style={s.name}>{r.name}</Text> : null}
        {contact.length > 0 && (
          <Text style={s.contact}>
            {contact.map((item, i) => (
              <Text key={item.key}>
                {i > 0 ? "   ·   " : ""}
                {item.href ? (
                  <Link src={item.href} style={s.contactLink}>
                    {item.text}
                  </Link>
                ) : (
                  item.text
                )}
              </Text>
            ))}
          </Text>
        )}

        {r.summary ? (
          <PdfSection headingStyle={s.heading} title="Summary">
            <Text style={s.paragraph}>{r.summary}</Text>
          </PdfSection>
        ) : null}

        {r.experience.length > 0 && (
          <PdfSection headingStyle={s.heading} title="Experience">
            {r.experience.map((item, i) => (
              <View key={i} style={s.entry}>
                <View wrap={false}>
                  {item.role || item.company ? (
                    <Text style={s.entryTitle}>{joinParts(item.role, item.company)}</Text>
                  ) : null}
                  {item.duration ? <Text style={s.meta}>{item.duration}</Text> : null}
                </View>
                {item.bullets.map((bullet, j) => (
                  <View key={j} style={s.bulletRow} wrap={false}>
                    <Text style={s.bullet}>–</Text>
                    <Text style={s.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </PdfSection>
        )}

        {r.education.length > 0 && (
          <PdfSection headingStyle={s.heading} title="Education">
            {r.education.map((item, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <Text style={s.entryTitle}>{joinParts(item.degree, item.institution)}</Text>
                {item.year ? <Text style={s.meta}>{item.year}</Text> : null}
              </View>
            ))}
          </PdfSection>
        )}

        {r.skills.length > 0 && (
          <PdfSection headingStyle={s.heading} title="Skills">
            <Text style={s.paragraph}>{r.skills.join(", ")}</Text>
          </PdfSection>
        )}

        {r.projects.length > 0 && (
          <PdfSection headingStyle={s.heading} title="Projects">
            {r.projects.map((item, i) => (
              <View key={i} style={s.entry} wrap={false}>
                {item.name ? <Text style={s.entryTitle}>{item.name}</Text> : null}
                {item.description ? <Text>{item.description}</Text> : null}
                {item.tech.length > 0 && <Text style={s.meta}>{item.tech.join(", ")}</Text>}
                {item.link ? (
                  <Link src={hrefFor(item.link)} style={s.link}>
                    {displayUrl(item.link)}
                  </Link>
                ) : null}
              </View>
            ))}
          </PdfSection>
        )}
      </Page>
    </Document>
  )
}
