<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { buildSkillsTsLines } from '@/utils/index'

const store = useResumeStore()

// Only maps to logos actually present under public/svg/ — skill names come
// from the API as free text, so unmatched skills just render without an icon
// rather than guessing/faking one.
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
}

function skillIcon(name: string): string | undefined {
  return SKILL_ICONS[name.toLowerCase().replace(/[^a-z0-9]/g, '')]
}

const groupedSkills = computed(() => {
  const result: { label: string; skills: { name: string; exp?: number; icon?: string }[] }[] = []
  for (const gr of store.groups) {
    const filtered = store.skills.filter((s) => s.group === gr)
    if (filtered.length) result.push({ label: gr, skills: filtered.map((s) => ({ ...s, icon: skillIcon(s.name) })) })
  }
  const rest = store.skills.filter((s) => !Object.hasOwn(s, 'group'))
  if (rest.length) result.push({ label: 'Other', skills: rest.map((s) => ({ ...s, icon: skillIcon(s.name) })) })
  return result
})

const lines = computed(() => buildSkillsTsLines(groupedSkills.value))
</script>

<template>
  <EditorCodeBlock :lines="lines" />
</template>
