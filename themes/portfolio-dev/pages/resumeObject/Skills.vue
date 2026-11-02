<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import { buildPersonalSkillsTsLines, buildSkillGroupTsLines, buildSkillsTsLines, groupSkills, skillIcon } from '@/utils/index'

const props = defineProps<{ file: 'skills.ts' | 'skill-group.ts' }>()

const store = useResumeStore()

const groupedSkills = computed(() =>
  groupSkills(store.groups, store.skills).map(({ label, skills }) => ({
    label,
    skills: skills.map((s) => ({ name: s.name, exp: s.yearsOfExperience, icon: skillIcon(s.name) })),
  })),
)

const lines = computed(() => {
  if (props.file === 'skill-group.ts') return buildSkillGroupTsLines(groupedSkills.value)
  const result = buildSkillsTsLines(groupedSkills.value)
  if (store.personalSkills.length) result.push({ html: '' }, ...buildPersonalSkillsTsLines(store.personalSkills))
  return result
})
</script>

<template>
  <ThemeCodeBlock :lines="lines" />
</template>
