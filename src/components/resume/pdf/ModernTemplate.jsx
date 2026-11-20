import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import {
  MARGIN,
  PAGE_SIZE,
  contactItems,
  displayUrl,
  hrefFor,
  joinParts,
  latestRole,
  normalizeResume,
} from "./pdfUtils"
import PdfSection from "./PdfSection"

const NAVY = "#1A1F2E"
const RED = "#D50032"
const BODY = "#1F2937"
const SECONDARY = "#555555"
const SIDEBAR_MUTED = "#B8BECC"
const SIDEBAR_WIDTH = "35%"

const s = StyleSheet.create({
  page: {
    flexDirection: "row",
    paddingVertical: MARGIN.vertical,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.4,
    color: BODY,
  },
  // Full-height navy panel, repeated on every page (it sits behind the sidebar text).
  sidebarBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: NAVY,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    paddingLeft: MARGIN.horizontal,
    paddingRight: 18,
    color: "#FFFFFF",
  },
  main: { width: "65%", paddingLeft: 24, paddingRight: MARGIN.horizontal },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", lineHeight: 1.2, color: "#FFFFFF" },
  role: { marginTop: 4, fontSize: 10, color: SIDEBAR_MUTED },
  divider: { marginVertical: 14, borderBottomWidth: 0.75, borderBottomColor: "#3A4256" },
  sideHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    color: SIDEBAR_MUTED,
    marginBottom: 8,
  },
  contactItem: { marginBottom: 8 },
  contactLabel: { fontSize: 7, letterSpacing: 1, color: SIDEBAR_MUTED },
  contactValue: { fontSize: 8.5, color: "#FFFFFF", textDecoration: "none" },
  pills: { flexDirection: "row", flexWrap: "wrap" },
  pill: {
    fontSize: 8,
    color: "#FFFFFF",
    borderWidth: 0.75,
    borderColor: "#4A5368",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  section: { marginBottom: 14 },
  heading: { fontSize: 11, fontFamily: "Helvetica-Bold", color: RED, marginBottom: 6 },
  entry: { marginBottom: 8 },
  entryTitle: { fontFamily: "Helvetica-Bold", color: NAVY },
  meta: { color: SECONDARY },
  bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
  bullet: { width: 10, color: RED },
  bulletText: { flex: 1 },
  link: { color: RED, textDecoration: "none" },
})

// Modern: navy sidebar (35%) with name, contact and skills; main column (65%) with the rest.
export default function ModernTemplate({ content, title }) {
  const r = normalizeResume(content)
  const contact = contactItems(r.contact)
  const role = latestRole(r.experience)

  return (
    <Document title={r.name || title} author={r.name} subject={title}>
      <Page size={PAGE_SIZE} style={s.page}>
        <View style={s.sidebarBg} fixed />

        <View style={s.sidebar}>
          {r.name ? <Text style={s.name}>{r.name}</Text> : null}
          {role ? <Text style={s.role}>{role}</Text> : null}

          {contact.length > 0 && (
            <>
              <View style={s.divider} />
              {contact.map((item) => (
                <View key={item.key} style={s.contactItem} wrap={false}>
                  <Text style={s.contactLabel}>{item.label.toUpperCase()}</Text>
                  {item.href ? (
                    <Link src={item.href} style={s.contactValue}>
                      {item.text}
                    </Link>
                  ) : (
                    <Text style={s.contactValue}>{item.text}</Text>
                  )}
                </View>
              ))}
            </>
          )}

          {r.skills.length > 0 && (
            <>
              <View style={s.divider} />
              <Text style={s.sideHeading}>SKILLS</Text>
              <View style={s.pills}>
                {r.skills.map((skill, i) => (
                  <Text key={i} style={s.pill}>
                    {skill}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={s.main}>
          {r.summary ? (
            <PdfSection style={s.section} headingStyle={s.heading} title="Summary">
              <Text>{r.summary}</Text>
            </PdfSection>
          ) : null}

          {r.experience.length > 0 && (
            <PdfSection style={s.section} headingStyle={s.heading} title="Experience">
              {r.experience.map((item, i) => (
                <View key={i} style={s.entry}>
                  <View wrap={false}>
                    {item.role || item.company ? (
                      <Text style={s.entryTitle}>{item.role || item.company}</Text>
                    ) : null}
                    {(item.role && item.company) || item.duration ? (
                      <Text style={s.meta}>
                        {joinParts(item.role ? item.company : "", item.duration)}
                      </Text>
                    ) : null}
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
                  <Text style={s.entryTitle}>{item.degree || item.institution}</Text>
                  {(item.degree && item.institution) || item.year ? (
                    <Text style={s.meta}>
                      {joinParts(item.degree ? item.institution : "", item.year)}
                    </Text>
                  ) : null}
                </View>
              ))}
            </PdfSection>
          )}

          {r.projects.length > 0 && (
            <PdfSection style={s.section} headingStyle={s.heading} title="Projects">
              {r.projects.map((item, i) => (
                <View key={i} style={s.entry} wrap={false}>
                  {item.name ? <Text style={s.entryTitle}>{item.name}</Text> : null}
                  {item.description ? <Text>{item.description}</Text> : null}
                  {item.tech.length > 0 && <Text style={s.meta}>{item.tech.join(" · ")}</Text>}
                  {item.link ? (
                    <Link src={hrefFor(item.link)} style={s.link}>
                      {displayUrl(item.link)}
                    </Link>
                  ) : null}
                </View>
              ))}
            </PdfSection>
          )}
        </View>
      </Page>
    </Document>
  )
}
