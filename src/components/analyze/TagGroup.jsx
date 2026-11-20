import Tag from "../ui/Tag"

export default function TagGroup({ title, tags, variant, emptyText, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  const list = Array.isArray(tags) ? tags : []
  return (
    <div className="flex flex-col gap-2">
      <Heading className="text-base font-semibold">{title}</Heading>
      {list.length === 0 ? (
        <p className="text-sm text-text-muted">{emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {list.map((tag, index) => (
            <li key={`${tag}-${index}`}>
              <Tag variant={variant}>{tag}</Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
