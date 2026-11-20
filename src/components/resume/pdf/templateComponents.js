import ClassicTemplate from "./ClassicTemplate"
import MinimalTemplate from "./MinimalTemplate"
import ModernTemplate from "./ModernTemplate"

// Template id (see templates.js) -> react-pdf <Document> component.
export const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
}
