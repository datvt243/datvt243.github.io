/**
 * Groups come from the skills themselves, not only the listed groups: the API
 * can return `professionalSkillsGroup` empty or incomplete, and a skill whose
 * group isn't listed must still show. Listed groups keep their order, then
 * first appearance; `other` (also used for a skill with no group) goes last.
 */
export function groupSkills<T extends { group?: string }>(listed: readonly string[], skills: readonly T[], other = 'Other') {
  const groupOf = (skill: T) => skill.group || other
  const labels = [...new Set([...listed, ...skills.map(groupOf)])].sort((a, b) => Number(a === other) - Number(b === other))
  return labels.map((label) => ({ label, skills: skills.filter((skill) => groupOf(skill) === label) })).filter((group) => group.skills.length)
}
