<script setup lang="ts">
import type { GitRepos } from '@/types/github'
const props = defineProps<{
	modelValue: GitRepos
}>()

const links: { field: keyof GitRepos; icon: string; class: string }[] = [
  { field: 'homepage', icon: 'fe:globe', class: 'text-blue-400' },
  { field: 'html_url', icon: 'fe:github', class: 'text-orange-400' },
]

const languageColors: Record<string, string> = {
  Vue: '#41b883',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  HTML: '#e34c26',
  Lua: '#000080',
  Pug: '#a86454',
}

const getFieldValue = (field: keyof GitRepos): string => {
  return props.modelValue[field]
}
</script>

<template>
  <div class="git-repos-item font-jetbrains">
    <div class="flex items-start justify-between gap-4">
      <p class="flex items-center flex-wrap gap-2">
        <a
          :href="modelValue.url"
          class="text-white font-bold text-lg hover:text-orange-400 transition-all"
        >{{ modelValue.name }}</a
        >
        <span class="px-2 py-0.5 rounded-full border border-slate-700 text-slate-400 text-xs leading-none">{{ modelValue.visibility }}</span>
      </p>
      <ul class="flex gap-2 shrink-0">
        <template v-for="el in links">
          <li v-if="getFieldValue(el.field)" :key="el.field">
            <a
              :href="getFieldValue(el?.field) || '#'"
              :class="[el.class, 'hover:opacity-50 transition-all']"
              target="_blank"
            >
              <UIcon :name="`${el.icon}`" class="w-5 h-5" />
            </a>
          </li>
        </template>
      </ul>
    </div>

    <p v-if="modelValue.description" class="text-slate-300 text-sm mt-1">{{ modelValue.description }}</p>

    <p v-if="modelValue.topics?.length" class="flex flex-wrap gap-2 mt-2">
      <UBadge v-for="t in modelValue.topics" :key="t" :label="t" variant="outline" />
    </p>

    <ul class="flex flex-wrap items-center gap-4 mt-3 text-sm">
      <li v-if="modelValue.language" class="flex items-center gap-1.5 text-slate-400">
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :style="{ backgroundColor: languageColors[modelValue.language] || '#8b8b8b' }"
        />
        {{ modelValue.language }}
      </li>
      <li v-if="modelValue.stargazers_count" class="flex items-center gap-1 text-slate-400">
        <UIcon name="fe:star" class="w-4 h-4" />
        {{ modelValue.stargazers_count }}
      </li>
      <li v-if="modelValue.forks_count" class="flex items-center gap-1 text-slate-400">
        <UIcon name="fe:fork" class="w-4 h-4" />
        {{ modelValue.forks_count }}
      </li>
      <li class="text-slate-500">Updated on {{ new Date(modelValue.updated_at).toLocaleDateString() }}</li>
    </ul>
  </div>
</template>
