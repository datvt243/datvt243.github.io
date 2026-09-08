<script setup lang="ts">
import type { GitRepos } from '@/types/github'
const { t } = useI18n()
const props = defineProps<{
	modelValue: GitRepos
}>()

const links: { field: keyof GitRepos; icon: string; class: string }[] = [
  { field: 'homepage', icon: 'fe:globe', class: 'text-theme-code-keyword' },
  { field: 'html_url', icon: 'fe:github', class: 'text-theme-accent' },
]

// Overrides UBadge's default Nuxt UI `{color}` variant (which never picks
// up the --theme-* CSS custom properties) with --theme-accent, same
// pattern proven in projects/Index.vue's techBadgeUi - Nuxt UI's `ui` prop
// merges via tailwind-merge per class-modifier group, so the `dark:`
// variant needs its own explicit override too, or the default
// `dark:text-{color}-400`/`dark:ring-{color}-400` classes survive.
const topicBadgeUi = {
  variant: {
    outline: 'text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40',
  },
}

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
  <div class="git-repos-item font-theme-mono">
    <div class="flex items-start justify-between gap-4">
      <p class="flex items-center flex-wrap gap-2">
        <a
          :href="modelValue.url"
          class="text-theme-text font-bold text-lg hover:text-theme-accent transition-all"
        >{{ modelValue.name }}</a
        >
        <span class="px-2 py-0.5 rounded-full border border-theme-border-subtle text-theme-muted text-xs leading-none">{{ modelValue.visibility }}</span>
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

    <p v-if="modelValue.description" class="text-theme-text-soft text-sm mt-1">{{ modelValue.description }}</p>

    <p v-if="modelValue.topics?.length" class="flex flex-wrap gap-2 mt-2">
      <UBadge v-for="topic in modelValue.topics" :key="topic" :label="topic" variant="outline" :ui="topicBadgeUi" />
    </p>

    <ul class="flex flex-wrap items-center gap-4 mt-3 text-sm">
      <li v-if="modelValue.language" class="flex items-center gap-1.5 text-theme-muted">
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :style="{ backgroundColor: languageColors[modelValue.language] || '#8b8b8b' }"
        />
        {{ modelValue.language }}
      </li>
      <li v-if="modelValue.stargazers_count" class="flex items-center gap-1 text-theme-muted">
        <UIcon name="fe:star" class="w-4 h-4" />
        {{ modelValue.stargazers_count }}
      </li>
      <li v-if="modelValue.forks_count" class="flex items-center gap-1 text-theme-muted">
        <UIcon name="fe:fork" class="w-4 h-4" />
        {{ modelValue.forks_count }}
      </li>
      <li class="text-theme-faint">{{ t('github.updatedOn') }} {{ new Date(modelValue.updated_at).toLocaleDateString() }}</li>
    </ul>
  </div>
</template>
