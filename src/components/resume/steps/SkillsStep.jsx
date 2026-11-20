import TagInput from "../TagInput"

export default function SkillsStep({ form }) {
  return (
    <TagInput
      id="skills"
      label="Skills"
      placeholder="Type a skill and press Enter"
      tags={form.data.content.skills}
      onAdd={form.addSkill}
      onRemove={form.removeSkill}
    />
  )
}
