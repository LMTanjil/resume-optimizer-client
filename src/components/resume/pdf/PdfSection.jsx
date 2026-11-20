import { Children } from "react"
import { Text, View } from "@react-pdf/renderer"

// A titled resume section. The heading and the section's first item are kept on the same page,
// so a heading is never left alone at the bottom of a page.
export default function PdfSection({ title, style, headingStyle, children }) {
  const [first, ...rest] = Children.toArray(children)
  return (
    <View style={style}>
      <View wrap={false}>
        <Text style={headingStyle}>{title}</Text>
        {first}
      </View>
      {rest}
    </View>
  )
}
