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

const SECONDARY = "#555555"

const s = StyleSheet.create({
  page: {
    paddingVertical: MARGIN.vertical,
    paddingHorizontal: MARGIN.horizontal,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.4,
    color: "#000000",
  },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", lineHeight: 1.2 },
  contact: { marginTop: 4, color: SECONDARY },
  link: { color: SECONDARY, textDecoration: "none" },
  rule: { marginTop: 10, borderBottomWidth: 0.75, borderBottomColor: "#000000" },
  section: { marginTop: 14 },
  heading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingBottom: 3,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  entry: { marginBottom: 8 },
  entryHead: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontFamily: "Helvetica-Bold", flexShrink: 1, paddingRight: 8 },
  meta: { color: SECONDARY },
  bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 8 },
  bullet: { width: 10, fontSize: 8, lineHeight: 1.75 },
  bulletText: { flex: 1 },
})

// Classic: single column, traditional layout.
export default function ClassicTemplate({ content, title }) {
  const r = normalizeResume(content)
  const contact = contactItems(r.contact)

  return (
    <Document title={r.name || title} author={r.name} subject={title}>
      <Page size={PAGE_SIZE} style={s.page}>
        <View>
          {r.name ? <Text style={s.name}>{r.name}</Text> : null}
          {contact.length > 0 && (
            <Text style={s.contact}>
              {contact.map((item, i) => (
                <Text key={item.key}>
                  {i > 0 ? " · " : ""}
                  {item.href ? (
                    <Link src={item.href} style={s.link}>
                      {item.text}
                    </Link>
                  ) : (
                    item.text
                  )}
                </Text>
              ))}
            </Text>
          )}
          <View style={s.rule} />
        </View>

        {r.summary ? (
          <PdfSection style={s.section} headingStyle={s.heading} title="Summary">
            <Text>{r.summary}</Text>
          </PdfSection>
        ) : null}

        {r.experience.length > 0 && (
          <PdfSection style={s.section} headingStyle={s.heading} title="Experience">
            {r.experience.map((item, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryHead} wrap={false}>
                  <Text style={s.entryTitle}>{joinParts(item.role, item.company)}</Text>
                  {item.duration ? <Text style={s.meta}>{item.duration}</Text> : null}
                </View>
                {item.bullets.map((bullet, j) => (
                  <View key={j} style={s.bulletRow} wrap={false}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={s.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </PdfSection>
        )}

        {r.education.length > 0 && (
          <PdfSection style={s.section} headingStyle={s.heading} title="Education">
            {r.education.map((item, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>{item.institution || item.degree}</Text>
                  {item.year ? <Text style={s.meta}>{item.year}</Text> : null}
                </View>
                {item.institution && item.degree ? <Text>{item.degree}</Text> : null}
              </View>
            ))}
          </PdfSection>
        )}

        {r.skills.length > 0 && (
          <PdfSection style={s.section} headingStyle={s.heading} title="Skills">
            <Text>{r.skills.join(", ")}</Text>
          </PdfSection>
        )}

        {r.projects.length > 0 && (
          <PdfSection style={s.section} headingStyle={s.heading} title="Projects">
            {r.projects.map((item, i) => (
              <View key={i} style={s.entry} wrap={false}>
                {item.name ? <Text style={s.entryTitle}>{item.name}</Text> : null}
                {item.description ? <Text>{item.description}</Text> : null}
                {item.tech.length > 0 && <Text style={s.meta}>Tech: {item.tech.join(", ")}</Text>}
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
