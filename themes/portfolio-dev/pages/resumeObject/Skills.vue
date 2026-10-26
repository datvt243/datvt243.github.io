<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import { buildPersonalSkillsTsLines, buildSkillsTsLines } from '@/utils/index'

const store = useResumeStore()

/**
 * Only maps to logos actually present under public/svg/ — skill names come
 * from the API as free text, so unmatched skills just render without an icon
 * rather than guessing/faking one.
 */
const SKILL_ICONS: Record<string, string> = {
  javascript: 'js',
  typescript: 'typescript',
  vuejs: 'vue-js',
  vue: 'vue-js',
  nuxtjs: 'nuxt-js',
  nuxt: 'nuxt-js',
  reactjs: 'react-js',
  react: 'react-js',
  nextjs: 'next-js',
  next: 'next-js',
  nodejs: 'node-js',
  node: 'node-js',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  bootstrap: 'bootstrap',
  tailwindcss: 'tailwindcss',
  tailwind: 'tailwindcss',
  git: 'git',
  sapui5: 'sapui5',
  pinia: 'pinia',
  gitlab: 'gitlab',
  github: 'github',
  sourcetree: 'sourcetree',
  mysql: 'mysql',
  postman: 'postman',
  html: 'html',
  htmlscss: 'html',
  scss: 'sass',
  sass: 'sass',
  // misspelled as-is in the resume API data - drop once fixed at the source
  gitlap: 'gitlab',
  githup: 'github',
  postmain: 'postman',
}

function skillIcon(name: string): string | undefined {
  return SKILL_ICONS[name.toLowerCase().replace(/[^a-z0-9]/g, '')]
}

/**
 * Groups come from the skills themselves, not only `professionalSkillsGroup`:
 * the API can return that list empty or incomplete, and a skill whose group
 * isn't listed must still render. Listed groups keep their order, 'Other' goes last.
 */
const groupedSkills = computed(() => {
  const labels = [...new Set([...store.groups, ...store.skills.map((s) => s.group)])].sort(
    (a, b) => Number(a === 'Other') - Number(b === 'Other'),
  )
  return labels
    .map((label) => ({
      label,
      skills: store.skills.filter((s) => s.group === label).map((s) => ({ name: s.name, exp: s.yearsOfExperience, icon: skillIcon(s.name) })),
    }))
    .filter((group) => group.skills.length)
})

const lines = computed(() => {
  const result = buildSkillsTsLines(groupedSkills.value)
  if (store.personalSkills.length) result.push({ html: '' }, ...buildPersonalSkillsTsLines(store.personalSkills))
  return result
})
</script>

<template>
  <ThemeCodeBlock :lines="lines" />
</template>
